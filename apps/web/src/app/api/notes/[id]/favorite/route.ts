import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

const bodySchema = z.object({
  favorite: z.boolean(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const { id: noteId } = await params;
  const userId = session.user.id;

  try {
    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", code: "INVALID_BODY" },
        { status: 400 },
      );
    }

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

    const { favorite } = parsed.data;
    const now = new Date();
    const state = await prisma.noteUserState.upsert({
      where: { userId_noteId: { userId, noteId } },
      create: {
        userId,
        noteId,
        isFavorite: favorite,
        favoritedAt: favorite ? now : null,
      },
      update: {
        isFavorite: favorite,
        favoritedAt: favorite ? now : null,
      },
      select: {
        isFavorite: true,
        favoritedAt: true,
      },
    });

    return NextResponse.json({
      message: favorite ? "Note favorited" : "Note unfavorited",
      data: {
        isFavorite: state.isFavorite,
        favoritedAt: state.favoritedAt?.toISOString() ?? null,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      {
        error: "Failed to update favorite",
        code: "FAILED_TO_UPDATE_FAVORITE",
      },
      { status: 500 },
    );
  }
}
