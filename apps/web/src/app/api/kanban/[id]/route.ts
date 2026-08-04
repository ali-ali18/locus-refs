import { updateKanbanBoardSchema } from "@refstash/shared";
import { type NextRequest, NextResponse } from "next/server";
import {
  boardNotFound,
  kanbanBoardDetailInclude,
  loadKanbanBoardDetail,
} from "@/lib/kanban/access";
import prisma from "@/lib/prisma";
import {
  boardDeletedEvent,
  boardUpdatedEvent,
} from "@/lib/realtime/kanban-event-builders";
import { publishKanbanEvent } from "@/lib/realtime/publish-kanban-event";
import {
  isWorkspaceAdmin,
  requireWorkspaceAccess,
} from "@/server/requireSession";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;
  const { id } = await context.params;

  const board = await loadKanbanBoardDetail(id, workspaceId);
  if (!board) return boardNotFound();

  await prisma.kanbanBoard.update({
    where: { id },
    data: { lastOpenedAt: new Date() },
  });

  return NextResponse.json(board);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const { id } = await context.params;

  const existing = await prisma.kanbanBoard.findFirst({
    where: { id, workspaceId, deletedAt: null },
    select: { id: true },
  });
  if (!existing) return boardNotFound();

  const parsed = updateKanbanBoardSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid input",
        code: "INVALID_INPUT",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const board = await prisma.kanbanBoard.update({
      where: { id },
      data: {
        ...(parsed.data.title !== undefined && { title: parsed.data.title }),
        ...(parsed.data.description !== undefined && {
          description: parsed.data.description,
        }),
        ...(parsed.data.icon !== undefined && { icon: parsed.data.icon }),
      },
      include: kanbanBoardDetailInclude,
    });
    void publishKanbanEvent(
      boardUpdatedEvent(id, workspaceId, session.user.id, board),
    );
    return NextResponse.json({ message: "Kanban board updated", data: board });
  } catch (_error) {
    return NextResponse.json(
      {
        error: "Failed to update kanban board",
        code: "FAILED_TO_UPDATE_KANBAN_BOARD",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId, memberRole } = auth;
  const { id } = await context.params;

  if (!isWorkspaceAdmin(memberRole)) {
    return NextResponse.json(
      { error: "Forbidden", code: "FORBIDDEN" },
      { status: 403 },
    );
  }

  const existing = await prisma.kanbanBoard.findFirst({
    where: { id, workspaceId, deletedAt: null },
    select: { id: true },
  });
  if (!existing) return boardNotFound();

  try {
    await prisma.kanbanBoard.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    void publishKanbanEvent(
      boardDeletedEvent(id, workspaceId, session.user.id),
    );
    return NextResponse.json({ message: "Kanban board deleted" });
  } catch (_error) {
    return NextResponse.json(
      {
        error: "Failed to delete kanban board",
        code: "FAILED_TO_DELETE_KANBAN_BOARD",
      },
      { status: 500 },
    );
  }
}
