import { updateKanbanCardSchema } from "@refstash/shared";
import { type NextRequest, NextResponse } from "next/server";
import {
  boardNotFound,
  cardNotFound,
  findKanbanBoardInWorkspace,
  resolveColumnId,
} from "@/lib/kanban/access";
import { kanbanUserSelect } from "@/lib/kanban/defaults";
import {
  computeFractionalPosition,
  nextAppendPosition,
} from "@/lib/kanban/position";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

interface RouteContext {
  params: Promise<{ id: string; cardId: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;
  const { id: boardId, cardId } = await context.params;

  const board = await findKanbanBoardInWorkspace(boardId, workspaceId);
  if (!board) return boardNotFound();

  const card = await prisma.kanbanCard.findFirst({
    where: { id: cardId, boardId },
  });
  if (!card) return cardNotFound();

  const parsed = updateKanbanCardSchema.safeParse(await request.json());
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

  if (parsed.data.assigneeId) {
    const member = await prisma.member.findFirst({
      where: {
        organizationId: workspaceId,
        userId: parsed.data.assigneeId,
      },
      select: { id: true },
    });
    if (!member) {
      return NextResponse.json(
        { error: "Assignee must be a workspace member", code: "INVALID_ASSIGNEE" },
        { status: 400 },
      );
    }
  }

  const wantsMove =
    parsed.data.columnId !== undefined ||
    parsed.data.columnName !== undefined ||
    parsed.data.beforeCardId !== undefined ||
    parsed.data.afterCardId !== undefined;

  let nextColumnId = card.columnId;
  let nextPosition: number | undefined;

  if (wantsMove) {
    if (parsed.data.columnId || parsed.data.columnName) {
      const resolved = await resolveColumnId({
        boardId,
        columnId: parsed.data.columnId,
        columnName: parsed.data.columnName,
      });
      if ("error" in resolved) return resolved.error;
      nextColumnId = resolved.columnId;
    }

    const hasNeighbors =
      parsed.data.beforeCardId !== undefined ||
      parsed.data.afterCardId !== undefined;

    if (hasNeighbors) {
      const [before, after] = await Promise.all([
        parsed.data.beforeCardId
          ? prisma.kanbanCard.findFirst({
              where: {
                id: parsed.data.beforeCardId,
                boardId,
                columnId: nextColumnId,
              },
              select: { position: true },
            })
          : Promise.resolve(null),
        parsed.data.afterCardId
          ? prisma.kanbanCard.findFirst({
              where: {
                id: parsed.data.afterCardId,
                boardId,
                columnId: nextColumnId,
              },
              select: { position: true },
            })
          : Promise.resolve(null),
      ]);

      if (parsed.data.beforeCardId && !before) return cardNotFound();
      if (parsed.data.afterCardId && !after) return cardNotFound();

      nextPosition = computeFractionalPosition(
        before?.position ?? null,
        after?.position ?? null,
      );
    } else if (nextColumnId !== card.columnId) {
      const agg = await prisma.kanbanCard.aggregate({
        where: { boardId, columnId: nextColumnId },
        _max: { position: true },
      });
      nextPosition = nextAppendPosition(agg._max.position);
    }
  }

  try {
    const updated = await prisma.kanbanCard.update({
      where: { id: cardId },
      data: {
        ...(parsed.data.title !== undefined && { title: parsed.data.title }),
        ...(parsed.data.description !== undefined && {
          description: parsed.data.description,
        }),
        ...(parsed.data.assigneeId !== undefined && {
          assigneeId: parsed.data.assigneeId,
        }),
        ...(wantsMove && { columnId: nextColumnId }),
        ...(nextPosition !== undefined && { position: nextPosition }),
      },
      include: {
        createdBy: { select: kanbanUserSelect },
        assignee: { select: kanbanUserSelect },
      },
    });

    return NextResponse.json({
      message: "Kanban card updated",
      data: updated,
    });
  } catch (_error) {
    return NextResponse.json(
      {
        error: "Failed to update kanban card",
        code: "FAILED_TO_UPDATE_KANBAN_CARD",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;
  const { id: boardId, cardId } = await context.params;

  const board = await findKanbanBoardInWorkspace(boardId, workspaceId);
  if (!board) return boardNotFound();

  const card = await prisma.kanbanCard.findFirst({
    where: { id: cardId, boardId },
    select: { id: true },
  });
  if (!card) return cardNotFound();

  try {
    await prisma.kanbanCard.delete({ where: { id: cardId } });
    return NextResponse.json({ message: "Kanban card deleted" });
  } catch (_error) {
    return NextResponse.json(
      {
        error: "Failed to delete kanban card",
        code: "FAILED_TO_DELETE_KANBAN_CARD",
      },
      { status: 500 },
    );
  }
}
