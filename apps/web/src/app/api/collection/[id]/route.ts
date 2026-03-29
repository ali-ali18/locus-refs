import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  const { id } = await params;

  const collection = await prisma.collection.findUnique({
    where: { id, workspaceId },
  });

  if (!collection) {
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 },
    );
  }

  const { name } = await request.json();

  try {
    const updatedCollection = await prisma.collection.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(
      {
        message: "Collection updated successfully",
        collection: updatedCollection,
      },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update collection" },
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

  const collection = await prisma.collection.findUnique({
    where: { id, workspaceId },
  });

  if (!collection) {
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 },
    );
  }

  try {
    await prisma.collection.delete({ where: { id } });
    return NextResponse.json(
      { message: "Collection deleted successfully" },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete collection" },
      { status: 500 },
    );
  }
}
