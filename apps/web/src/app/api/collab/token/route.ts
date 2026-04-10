import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/server/getSession";

export async function GET(request: NextRequest) {
  if (!process.env.COLLAB_JWT_SECRET) {
    throw new Error("COLLAB_JWT_SECRET not set");
  }

  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const noteId = request.nextUrl.searchParams.get("noteId");
  const workspaceId = request.nextUrl.searchParams.get("workspaceId");

  if (!noteId || !workspaceId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const member = await prisma.member.findFirst({
    where: { organizationId: workspaceId, userId: session.user.id },
  });
  if (!member) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const note = await prisma.note.findFirst({
    where: { id: noteId, workspaceId },
    select: { id: true },
  });
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const token = jwt.sign(
    { userId: session.user.id, workspaceId, noteId },
    process.env.COLLAB_JWT_SECRET,
    { expiresIn: "1h" },
  );

  return NextResponse.json({ token });
}
