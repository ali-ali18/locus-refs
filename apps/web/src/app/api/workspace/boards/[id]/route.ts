import type { UpdateBoardSchema } from "@refstash/shared";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;
  const { id } = await context.params;

  const board = await prisma.board.findFirst({
    where: { id, workspaceId, deletedAt: null },
  });
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }
  return NextResponse.json(board);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const { id } = await context.params;

  const member = await prisma.member.findFirst({
    where: { organizationId: workspaceId, userId: session.user.id },
    select: { role: true },
  });
  if (member?.role === "member") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as UpdateBoardSchema;
    const board = await prisma.board.update({
      where: { id, workspaceId, deletedAt: null },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.icon !== undefined && { icon: body.icon }),
      },
    });
    return NextResponse.json({ data: board });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update board", code: "FAILED_TO_UPDATE_BOARD" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const { id } = await context.params;

  const member = await prisma.member.findFirst({
    where: { organizationId: workspaceId, userId: session.user.id },
    select: { role: true },
  });
  if (member?.role === "member") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.board.update({
      where: { id, workspaceId },
      data: { deletedAt: new Date() },
    });
    return NextResponse.json({ message: "Board deleted" });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete board", code: "FAILED_TO_DELETE_BOARD" },
      { status: 500 },
    );
  }
}
