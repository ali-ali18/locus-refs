import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";
import { deleteObjects } from "@/server/upload";

function extractS3ImageKeys(html: string, workspaceId: string): string[] {
  const regex = /src=["']\/storage\/([^"']+)["']/g;
  return [...html.matchAll(regex)]
    .map((m) => decodeURIComponent(m[1]))
    .filter((key) => key.startsWith(`${workspaceId}/notes/`));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;
  const { id } = await params;

  try {
    const note = await prisma.note.findUnique({
      where: { id, workspaceId },
      include: {
        collection: { select: { id: true, name: true } },
        linkedTo: {
          select: { target: { select: { id: true, title: true, icon: true } } },
        },
        linkedFrom: {
          select: { source: { select: { id: true, title: true, icon: true } } },
        },
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to get note" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;
  const { id } = await params;

  try {
    const { title, icon, content, collectionId } = await request.json();

    let orphanedKeys: string[] = [];
    if (content !== undefined) {
      const existing = await prisma.note.findUnique({
        where: { id, workspaceId },
        select: { content: true },
      });
      if (existing?.content) {
        const oldKeys = extractS3ImageKeys(existing.content, workspaceId);
        const newKeys = new Set(extractS3ImageKeys(content, workspaceId));
        orphanedKeys = oldKeys.filter((k) => !newKeys.has(k));
      }
    }

    const [updatedNote] = await prisma.note.updateManyAndReturn({
      where: { id, workspaceId },
      data: {
        ...(title !== undefined && { title }),
        ...(icon !== undefined && { icon }),
        ...(content !== undefined && { content }),
        ...(collectionId !== undefined && { collectionId }),
      },
    });

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (orphanedKeys.length > 0) {
      deleteObjects(orphanedKeys).catch(console.error);
    }

    return NextResponse.json(
      { message: "Note updated successfully", note: updatedNote },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;
  const { id } = await params;

  try {
    const note = await prisma.note.findUnique({
      where: { id, workspaceId },
      select: { content: true },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await prisma.note.delete({ where: { id } });

    if (note.content) {
      const keys = extractS3ImageKeys(note.content, workspaceId);
      if (keys.length > 0) deleteObjects(keys).catch(console.error);
    }

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 },
    );
  }
}
