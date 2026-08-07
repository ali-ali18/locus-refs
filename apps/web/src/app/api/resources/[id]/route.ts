import { type NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireWorkspacePermission } from "@/server/permissions";
import { updateSchema } from "@/types/schema/resources.schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspacePermission(request, {
    resource: ["update"],
  });
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  const { id } = await params;

  const body = updateSchema.parse(await request.json());

  const resource = await prisma.resource.findFirst({
    where: { id, collection: { workspaceId } },
  });

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  if (
    body.collectionId !== undefined &&
    body.collectionId !== resource.collectionId
  ) {
    const newCollection = await prisma.collection.findUnique({
      where: { id: body.collectionId, workspaceId },
    });

    if (!newCollection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 },
      );
    }
  }

  if (body.categoryIds !== undefined && body.categoryIds.length > 0) {
    const validCategories = await prisma.category.findMany({
      where: { id: { in: body.categoryIds }, workspaceId },
      select: { id: true },
    });
    const validIds = new Set(validCategories.map((c) => c.id));
    if (body.categoryIds.some((id) => !validIds.has(id))) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 },
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspacePermission(request, {
    resource: ["delete"],
  });
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  const { id } = await params;

  const resource = await prisma.resource.findFirst({
    where: { id, collection: { workspaceId } },
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
