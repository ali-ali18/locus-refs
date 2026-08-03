import { createKanbanCardSchema } from "@refstash/shared";
import { type NextRequest, NextResponse } from "next/server";
import {
  boardNotFound,
  findKanbanBoardInWorkspace,
  resolveColumnId,
} from "@/lib/kanban/access";
import { kanbanUserSelect } from "@/lib/kanban/defaults";
import { nextAppendPosition } from "@/lib/kanban/position";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function assertWorkspaceMember(workspaceId: string, userId: string) {
  return prisma.member.findFirst({
    where: { organizationId: workspaceId, userId },
    select: { id: true },
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const { id: boardId } = await context.params;

  const board = await findKanbanBoardInWorkspace(boardId, workspaceId);
  if (!board) return boardNotFound();

  const parsed = createKanbanCardSchema.safeParse(await request.json());
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

  const resolved = await resolveColumnId({
    boardId,
    columnId: parsed.data.columnId,
    columnName: parsed.data.columnName,
  });
  if ("error" in resolved) return resolved.error;

  let assigneeId: string | null = parsed.data.assigneeId ?? null;
  if (assigneeId) {
    const member = await assertWorkspaceMember(workspaceId, assigneeId);
    if (!member) {
      return NextResponse.json(
        { error: "Assignee must be a workspace member", code: "INVALID_ASSIGNEE" },
        { status: 400 },
      );
    }
  }

  const agg = await prisma.kanbanCard.aggregate({
    where: { boardId, columnId: resolved.columnId },
    _max: { position: true },
  });

  try {
    const card = await prisma.kanbanCard.create({
      data: {
        boardId,
        columnId: resolved.columnId,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        assigneeId,
        position: nextAppendPosition(agg._max.position),
        createdById: session.user.id,
      },
      include: {
        createdBy: { select: kanbanUserSelect },
        assignee: { select: kanbanUserSelect },
      },
    });

    return NextResponse.json(
      { message: "Kanban card created", data: card },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      {
        error: "Failed to create kanban card",
        code: "FAILED_TO_CREATE_KANBAN_CARD",
      },
      { status: 500 },
    );
  }
}
