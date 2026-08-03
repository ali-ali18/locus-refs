import {
  createKanbanColumnSchema,
  MAX_KANBAN_COLUMNS,
} from "@refstash/shared";
import { type NextRequest, NextResponse } from "next/server";
import { boardNotFound, findKanbanBoardInWorkspace } from "@/lib/kanban/access";
import { nextAppendPosition } from "@/lib/kanban/position";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;
  const { id: boardId } = await context.params;

  const board = await findKanbanBoardInWorkspace(boardId, workspaceId);
  if (!board) return boardNotFound();

  const parsed = createKanbanColumnSchema.safeParse(await request.json());
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

  const columnCount = await prisma.kanbanColumn.count({ where: { boardId } });
  if (columnCount >= MAX_KANBAN_COLUMNS) {
    return NextResponse.json(
      {
        error: `Maximum of ${MAX_KANBAN_COLUMNS} columns per board`,
        code: "KANBAN_COLUMN_LIMIT",
      },
      { status: 400 },
    );
  }

  const agg = await prisma.kanbanColumn.aggregate({
    where: { boardId },
    _max: { position: true },
  });

  try {
    const column = await prisma.kanbanColumn.create({
      data: {
        boardId,
        name: parsed.data.name,
        color: parsed.data.color ?? null,
        position: nextAppendPosition(agg._max.position),
      },
    });
    return NextResponse.json(
      { message: "Kanban column created", data: column },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      {
        error: "Failed to create kanban column",
        code: "FAILED_TO_CREATE_KANBAN_COLUMN",
      },
      { status: 500 },
    );
  }
}
