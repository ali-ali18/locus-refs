import { type NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import prisma from "@/lib/prisma";
import { requireSessionApiOrThrow } from "@/server/requireSession";

export async function GET() {
  try {
    const session = await requireSessionApiOrThrow();

    const collections = await prisma.collection.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(collections);
  } catch (_error) {
    console.log(_error);
    return NextResponse.json(
      { error: "Failed to get collections" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await requireSessionApiOrThrow();

  const { name } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = slugify(name, { lower: true, strict: true });

  try {
    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        userId: session.user.id,
      },
    });
    return NextResponse.json(
      { message: "Collection created successfully", collection },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 },
    );
  }
}
