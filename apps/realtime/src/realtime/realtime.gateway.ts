import { Inject, Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import {
  kanbanBoardRoom,
  type KanbanRealtimeEvent,
} from "@refstash/shared";
import jwt from "jsonwebtoken";
import type { Server, Socket } from "socket.io";
import { PrismaService } from "../prisma/prisma.service";

export type RealtimeJwtPayload = {
  userId: string;
  workspaceId: string;
  name?: string | null;
  image?: string | null;
};

export type PresenceMember = {
  userId: string;
  name: string | null;
  image: string | null;
  socketId: string;
};

type SocketData = {
  user: RealtimeJwtPayload;
  boardId?: string;
};

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(RealtimeGateway.name);

  /** boardId → socketId → presence */
  private readonly presence = new Map<string, Map<string, PresenceMember>>();

  @WebSocketServer()
  server!: Server;

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  broadcastKanbanEvent(event: KanbanRealtimeEvent) {
    this.server
      .to(kanbanBoardRoom(event.boardId))
      .emit("kanban:event", event);
  }

  async handleConnection(client: Socket) {
    const secret = process.env.REALTIME_JWT_SECRET;
    if (!secret) {
      this.logger.error("REALTIME_JWT_SECRET is not set");
      client.disconnect(true);
      return;
    }

    const token =
      (client.handshake.auth?.token as string | undefined) ??
      (typeof client.handshake.query?.token === "string"
        ? client.handshake.query.token
        : undefined);

    if (!token) {
      client.emit("error", { message: "Missing auth token" });
      client.disconnect(true);
      return;
    }

    try {
      const payload = jwt.verify(token, secret) as RealtimeJwtPayload;
      if (!payload.userId || !payload.workspaceId) {
        throw new Error("Invalid token payload");
      }
      (client.data as SocketData).user = payload;
    } catch {
      client.emit("error", { message: "Unauthorized" });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const data = client.data as SocketData;
    if (data.boardId) {
      this.leaveBoard(client, data.boardId);
    }
  }

  @SubscribeMessage("board:join")
  async onBoardJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { boardId?: string },
  ) {
    const data = client.data as SocketData;
    const user = data.user;
    if (!user) {
      return { ok: false, error: "Unauthorized" };
    }

    const boardId = body?.boardId?.trim();
    if (!boardId) {
      return { ok: false, error: "boardId is required" };
    }

    const board = await this.prisma.kanbanBoard.findFirst({
      where: {
        id: boardId,
        workspaceId: user.workspaceId,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (!board) {
      return { ok: false, error: "Board not found" };
    }

    const member = await this.prisma.member.findFirst({
      where: {
        organizationId: user.workspaceId,
        userId: user.userId,
      },
      select: { id: true },
    });
    if (!member) {
      return { ok: false, error: "Forbidden" };
    }

    if (data.boardId && data.boardId !== boardId) {
      this.leaveBoard(client, data.boardId);
    }

    const room = kanbanBoardRoom(boardId);
    await client.join(room);
    data.boardId = boardId;

    let roomPresence = this.presence.get(boardId);
    if (!roomPresence) {
      roomPresence = new Map();
      this.presence.set(boardId, roomPresence);
    }
    roomPresence.set(client.id, {
      userId: user.userId,
      name: user.name ?? null,
      image: user.image ?? null,
      socketId: client.id,
    });

    this.emitPresenceSync(boardId);
    return { ok: true, boardId, room };
  }

  @SubscribeMessage("board:leave")
  async onBoardLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { boardId?: string },
  ) {
    const data = client.data as SocketData;
    const boardId = body?.boardId?.trim() || data.boardId;
    if (!boardId) {
      return { ok: false, error: "boardId is required" };
    }
    this.leaveBoard(client, boardId);
    return { ok: true, boardId };
  }

  private leaveBoard(client: Socket, boardId: string) {
    const room = kanbanBoardRoom(boardId);
    void client.leave(room);

    const data = client.data as SocketData;
    if (data.boardId === boardId) {
      data.boardId = undefined;
    }

    const roomPresence = this.presence.get(boardId);
    if (roomPresence) {
      const member = roomPresence.get(client.id);
      roomPresence.delete(client.id);
      if (roomPresence.size === 0) {
        this.presence.delete(boardId);
      }
      if (member) {
        this.server.to(room).emit("presence:leave", {
          boardId,
          userId: member.userId,
          socketId: client.id,
        });
      }
      this.emitPresenceSync(boardId);
    }
  }

  private emitPresenceSync(boardId: string) {
    const room = kanbanBoardRoom(boardId);
    const members = [...(this.presence.get(boardId)?.values() ?? [])];
    // Deduplicate by userId (same user, multiple tabs → last socket wins in list unique)
    const byUser = new Map<string, PresenceMember>();
    for (const m of members) {
      byUser.set(m.userId, m);
    }
    this.server.to(room).emit("presence:sync", {
      boardId,
      members: [...byUser.values()].map(({ userId, name, image }) => ({
        userId,
        name,
        image,
      })),
    });
  }
}
