import { updateKanbanColumnSchema } from "@refstash/shared";
import { type NextRequest, NextResponse } from "next/server";
import {
  boardNotFound,
  columnNotFound,
  findKanbanBoardInWorkspace,
} from "@/lib/kanban/access";
import { computeFractionalPosition } from "@/lib/kanban/position";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

interface RouteContext {
  params: Promise<{ id: string; columnId: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;
  const { id: boardId, columnId } = await context.params;

  const board = await findKanbanBoardInWorkspace(boardId, workspaceId);
  if (!board) return boardNotFound();

  const column = await prisma.kanbanColumn.findFirst({
    where: { id: columnId, boardId },
  });
  if (!column) return columnNotFound();

  const parsed = updateKanbanColumnSchema.safeParse(await request.json());
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

  let position: number | undefined;
  if (
    parsed.data.beforeColumnId !== undefined ||
    parsed.data.afterColumnId !== undefined
  ) {
    const [before, after] = await Promise.all([
      parsed.data.beforeColumnId
        ? prisma.kanbanColumn.findFirst({
            where: { id: parsed.data.beforeColumnId, boardId },
            select: { position: true },
          })
        : Promise.resolve(null),
      parsed.data.afterColumnId
        ? prisma.kanbanColumn.findFirst({
            where: { id: parsed.data.afterColumnId, boardId },
            select: { position: true },
          })
        : Promise.resolve(null),
    ]);

    if (parsed.data.beforeColumnId && !before) return columnNotFound();
    if (parsed.data.afterColumnId && !after) return columnNotFound();

    position = computeFractionalPosition(
      before?.position ?? null,
      after?.position ?? null,
    );
  }

  try {
    const updated = await prisma.kanbanColumn.update({
      where: { id: columnId },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.color !== undefined && { color: parsed.data.color }),
        ...(position !== undefined && { position }),
      },
    });
    return NextResponse.json({
      message: "Kanban column updated",
      data: updated,
    });
  } catch (_error) {
    return NextResponse.json(
      {
        error: "Failed to update kanban column",
        code: "FAILED_TO_UPDATE_KANBAN_COLUMN",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;
  const { id: boardId, columnId } = await context.params;

  const board = await findKanbanBoardInWorkspace(boardId, workspaceId);
  if (!board) return boardNotFound();

  const column = await prisma.kanbanColumn.findFirst({
    where: { id: columnId, boardId },
    select: { id: true },
  });
  if (!column) return columnNotFound();

  const remaining = await prisma.kanbanColumn.count({ where: { boardId } });
  if (remaining <= 1) {
    return NextResponse.json(
      {
        error: "Board must keep at least one column",
        code: "KANBAN_LAST_COLUMN",
      },
      { status: 400 },
    );
  }

  try {
    await prisma.kanbanColumn.delete({ where: { id: columnId } });
    return NextResponse.json({ message: "Kanban column deleted" });
  } catch (_error) {
    return NextResponse.json(
      {
        error: "Failed to delete kanban column",
        code: "FAILED_TO_DELETE_KANBAN_COLUMN",
      },
      { status: 500 },
    );
  }
}
