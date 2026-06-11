import type { CreateBoardSchema } from "@refstash/shared";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

export async function GET(_request: NextRequest) {
  const auth = await requireWorkspaceAccess(_request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  try {
    const boards = await prisma.board.findMany({
      where: { workspaceId, deletedAt: null },
      orderBy: [{ lastOpenedAt: "desc" }, { updatedAt: "desc" }],
    });
    return NextResponse.json(boards);
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to get boards", code: "FAILED_TO_GET_BOARDS" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;

  try {
    const body = (await request.json()) as CreateBoardSchema;
    const board = await prisma.board.create({
      data: {
        title: body.title,
        description: body.description ?? null,
        icon: body.icon ?? null,
        workspaceId,
        createdById: session.user.id,
      },
    });
    return NextResponse.json({ data: board }, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create board", code: "FAILED_TO_CREATE_BOARD" },
      { status: 500 },
    );
  }
}
