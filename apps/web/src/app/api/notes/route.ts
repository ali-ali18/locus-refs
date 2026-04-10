import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

export async function GET(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  try {
    const notes = await prisma.note.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        icon: true,
        collectionId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(notes);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to get notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;

  try {
    const { title, icon, collectionId } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required", code: "MISSING_TITLE" },
        { status: 400 },
      );
    }
    const note = await prisma.note.create({
      data: {
        title,
        icon: icon ?? null,
        content: "",
        userId: session.user.id,
        workspaceId,
        collectionId: collectionId ?? null,
      },
    });
    return NextResponse.json(
      { message: "Note created successfully", note },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create note", code: "FAILED_TO_CREATE_NOTE" },
      { status: 500 },
    );
  }
}
