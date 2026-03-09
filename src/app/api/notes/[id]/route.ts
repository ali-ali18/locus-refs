import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/server/requireSession";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  const { id } = await params;

  try {
    const note = await prisma.note.findUnique({
      where: { id, userId: session.user.id },
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
  const session = await requireSession();
  const { id } = await params;

  try {
    const { title, icon, content, collectionId } = await request.json();
    const [updatedNote] = await prisma.note.updateManyAndReturn({
      where: { id, userId: session.user.id },
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
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  const { id } = await params;

  try {
    const { count } = await prisma.note.deleteMany({
      where: { id, userId: session.user.id },
    });

    if (count === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
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
