import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/server/requireSession";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  const { id } = await params;

  const collection = await prisma.collection.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!collection) {
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 },
    );
  }

  const categories = await prisma.category.findMany({
    where: {
      resources: {
        some: {
          collectionId: id,
        },
      },
    },
    include: {
      _count: {
        select: {
          resources: {
            where: {
              collectionId: id,
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const formattedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    _count: {
      resources: cat._count.resources,
    },
  }));

  return NextResponse.json(formattedCategories);
}
