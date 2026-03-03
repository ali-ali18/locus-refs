
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/server/requireSession";

export async function GET(request: NextRequest) {
  const session = await requireSession();
  const collectionId = request.nextUrl.searchParams.get("collectionId");

  const where =
    collectionId != null && collectionId !== ""
      ? {
          collectionId,
          collection: { userId: session.user.id },
        }
      : { collection: { userId: session.user.id } };

  const resources = await prisma.resource.findMany({
    where,
    include: {
      categories: { select: { id: true, name: true, slug: true } },
    },
  });

  return NextResponse.json(resources);
}

export async function POST(request: NextRequest) {
  const session = await requireSession();

  const {
    title,
    url,
    collectionId,
    description,
    iconUrl,
    ogImageUrl,
    categoryIds,
  } = await request.json();

  if (!title || !url || !collectionId || !categoryIds) {
    return NextResponse.json(
      { error: "Title, URL, Collection ID and Category IDs are required" },
      { status: 400 },
    );
  }

  const collection = await prisma.collection.findUnique({
    where: { id: collectionId, userId: session.user.id },
  });

  if (!collection) {
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 },
    );
  }

  try {
    const resource = await prisma.resource.create({
      data: {
        title,
        url,
        description,
        iconUrl,
        ogImageUrl,
        collectionId,
        fetchedAt: new Date(),
        categories: {
          connect: categoryIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json(
      { message: "Resource created successfully", resource },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 },
    );
  }
}
