import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

const RECENT_LIMIT = 12;

export async function GET(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const userId = session.user.id;

  try {
    const [favoriteStates, recentStates] = await Promise.all([
      prisma.noteUserState.findMany({
        where: {
          userId,
          isFavorite: true,
          note: { workspaceId },
        },
        orderBy: { favoritedAt: "desc" },
        select: {
          favoritedAt: true,
          note: {
            select: {
              id: true,
              title: true,
              icon: true,
            },
          },
        },
      }),
      prisma.noteUserState.findMany({
        where: {
          userId,
          lastOpenedAt: { not: null },
          note: { workspaceId },
        },
        orderBy: { lastOpenedAt: "desc" },
        take: RECENT_LIMIT,
        select: {
          lastOpenedAt: true,
          isFavorite: true,
          note: {
            select: {
              id: true,
              title: true,
              icon: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      favorites: favoriteStates.map((state) => ({
        id: state.note.id,
        title: state.note.title,
        icon: state.note.icon,
        favoritedAt: state.favoritedAt?.toISOString() ?? null,
      })),
      recents: recentStates.map((state) => ({
        id: state.note.id,
        title: state.note.title,
        icon: state.note.icon,
        lastOpenedAt: state.lastOpenedAt?.toISOString() ?? null,
        isFavorite: state.isFavorite,
      })),
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to load note pins", code: "FAILED_TO_LOAD_NOTE_PINS" },
      { status: 500 },
    );
  }
}
