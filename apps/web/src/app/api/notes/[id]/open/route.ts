import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireWorkspacePermission } from "@/server/permissions";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspacePermission(request, { note: ["read"] });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const { id: noteId } = await params;
  const userId = session.user.id;

  try {
    const note = await prisma.note.findFirst({
      where: { id: noteId, workspaceId },
      select: { id: true },
    });
    if (!note) {
      return NextResponse.json(
        { error: "Note not found", code: "NOTE_NOT_FOUND" },
        { status: 404 },
      );
    }

    const now = new Date();
    const state = await prisma.noteUserState.upsert({
      where: { userId_noteId: { userId, noteId } },
      create: {
        userId,
        noteId,
        lastOpenedAt: now,
      },
      update: {
        lastOpenedAt: now,
      },
      select: {
        lastOpenedAt: true,
        isFavorite: true,
      },
    });

    return NextResponse.json({
      message: "Note opened",
      data: {
        lastOpenedAt: state.lastOpenedAt?.toISOString() ?? null,
        isFavorite: state.isFavorite,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to record note open", code: "FAILED_TO_OPEN_NOTE" },
      { status: 500 },
    );
  }
}
