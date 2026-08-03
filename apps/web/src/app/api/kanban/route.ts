import { createKanbanBoardSchema } from "@refstash/shared";
import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_KANBAN_COLUMNS, kanbanUserSelect } from "@/lib/kanban/defaults";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

export async function GET(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  try {
    const boards = await prisma.kanbanBoard.findMany({
      where: { workspaceId, deletedAt: null },
      orderBy: [{ lastOpenedAt: "desc" }, { updatedAt: "desc" }],
      include: {
        createdBy: { select: kanbanUserSelect },
        _count: { select: { cards: true, columns: true } },
      },
    });
    return NextResponse.json(boards);
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to get kanban boards", code: "FAILED_TO_GET_KANBAN_BOARDS" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;

  const parsed = createKanbanBoardSchema.safeParse(await request.json());
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
    const board = await prisma.kanbanBoard.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        icon: parsed.data.icon ?? null,
        workspaceId,
        createdById: session.user.id,
        columns: {
          create: DEFAULT_KANBAN_COLUMNS.map((column) => ({
            name: column.name,
            color: column.color,
            position: column.position,
          })),
        },
      },
      include: {
        createdBy: { select: kanbanUserSelect },
        columns: { orderBy: { position: "asc" } },
        cards: {
          orderBy: { position: "asc" },
          include: {
            createdBy: { select: kanbanUserSelect },
            assignee: { select: kanbanUserSelect },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Kanban board created", data: board },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      {
        error: "Failed to create kanban board",
        code: "FAILED_TO_CREATE_KANBAN_BOARD",
      },
      { status: 500 },
    );
  }
}
