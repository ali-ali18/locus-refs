import { type NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireSessionApiOrThrow } from "@/server/requireSession";
import { updateSchema } from "@/types/schema/resources.schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSessionApiOrThrow();

  const { id } = await params;

  const body = updateSchema.parse(await request.json());

  const resource = await prisma.resource.findFirst({
    where: { id, collection: { userId: session.user.id } },
  });

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  if (
    body.collectionId !== undefined &&
    body.collectionId !== resource.collectionId
  ) {
    const newCollection = await prisma.collection.findUnique({
      where: { id: body.collectionId, userId: session.user.id },
    });

    if (!newCollection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 },
      );
    }
  }

  const updateData: Prisma.ResourceUncheckedUpdateInput = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.url !== undefined) updateData.url = body.url;
  if (body.iconUrl !== undefined) updateData.iconUrl = body.iconUrl;
  if (body.ogImageUrl !== undefined) updateData.ogImageUrl = body.ogImageUrl;
  if (body.collectionId !== undefined)
    updateData.collectionId = body.collectionId;
  if (body.categoryIds !== undefined) {
    updateData.categories = {
      set: body.categoryIds.map((categoryId) => ({ id: categoryId })),
    };
  }

  try {
    const updated = await prisma.resource.update({
      where: { id },
      data: updateData,
      include: {
        categories: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSessionApiOrThrow();

  const { id } = await params;

  const resource = await prisma.resource.findFirst({
    where: { id, collection: { userId: session.user.id } },
  });

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  try {
    await prisma.resource.delete({ where: { id } });
    return NextResponse.json(
      { message: "Resource deleted successfully" },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 },
    );
  }
}
