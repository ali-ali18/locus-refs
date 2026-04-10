import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

export async function GET(
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
