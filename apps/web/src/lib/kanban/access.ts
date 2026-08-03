import "server-only";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { kanbanUserSelect } from "@/lib/kanban/defaults";

export async function findKanbanBoardInWorkspace(
  boardId: string,
  workspaceId: string,
) {
  return prisma.kanbanBoard.findFirst({
    where: { id: boardId, workspaceId, deletedAt: null },
  });
}

export function boardNotFound() {
  return NextResponse.json(
    { error: "Kanban board not found", code: "KANBAN_BOARD_NOT_FOUND" },
    { status: 404 },
  );
}

export function columnNotFound() {
  return NextResponse.json(
    { error: "Kanban column not found", code: "KANBAN_COLUMN_NOT_FOUND" },
    { status: 404 },
  );
}

export function cardNotFound() {
  return NextResponse.json(
    { error: "Kanban card not found", code: "KANBAN_CARD_NOT_FOUND" },
    { status: 404 },
  );
}

export async function resolveColumnId(params: {
  boardId: string;
  columnId?: string;
  columnName?: string;
}): Promise<{ columnId: string } | { error: NextResponse }> {
  const { boardId, columnId, columnName } = params;

  if (columnId) {
    const column = await prisma.kanbanColumn.findFirst({
      where: { id: columnId, boardId },
      select: { id: true },
    });
    if (!column) return { error: columnNotFound() };
    return { columnId: column.id };
  }

  if (columnName) {
    const column = await prisma.kanbanColumn.findFirst({
      where: {
        boardId,
        name: { equals: columnName, mode: "insensitive" },
      },
      select: { id: true },
    });
    if (!column) return { error: columnNotFound() };
    return { columnId: column.id };
  }

  return {
    error: NextResponse.json(
      { error: "columnId or columnName is required", code: "INVALID_INPUT" },
      { status: 400 },
    ),
  };
}

export const kanbanBoardDetailInclude = {
  createdBy: { select: kanbanUserSelect },
  columns: { orderBy: { position: "asc" as const } },
  cards: {
    orderBy: { position: "asc" as const },
    include: {
      createdBy: { select: kanbanUserSelect },
      assignee: { select: kanbanUserSelect },
    },
  },
} as const;

export async function loadKanbanBoardDetail(
  boardId: string,
  workspaceId: string,
) {
  return prisma.kanbanBoard.findFirst({
    where: { id: boardId, workspaceId, deletedAt: null },
    include: kanbanBoardDetailInclude,
  });
}
