import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/server/getSession";

export async function GET(request: NextRequest) {
  if (!process.env.COLLAB_JWT_SECRET) {
    return NextResponse.json(
      { error: "Server misconfigured", code: "MISSING_JWT_SECRET" },
      { status: 500 },
    );
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const boardId = request.nextUrl.searchParams.get("boardId");
  const workspaceId = request.nextUrl.searchParams.get("workspaceId");
  if (!boardId || !workspaceId) {
    return NextResponse.json(
      { error: "Missing params", code: "MISSING_PARAMS" },
      { status: 400 },
    );
  }

  const member = await prisma.member.findFirst({
    where: { organizationId: workspaceId, userId: session.user.id },
    select: { role: true },
  });
  if (!member) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const board = await prisma.board.findFirst({
    where: { id: boardId, workspaceId, deletedAt: null },
    select: { id: true },
  });
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const token = jwt.sign(
    {
      userId: session.user.id,
      workspaceId,
      boardId,
      role: member.role,
    },
    process.env.COLLAB_JWT_SECRET,
    { expiresIn: "1h" },
  );

  return NextResponse.json({ token });
}
