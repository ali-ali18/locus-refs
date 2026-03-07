import { type NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import prisma from "@/lib/prisma";
import { requireSession } from "@/server/requireSession";

export async function GET() {
  const session = await requireSession();

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
    include: { _count: { select: { resources: true } } },
  });

  console.log(categories);
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const session = await requireSession();

  const { name } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = slugify(name, { lower: true, strict: true });

  try {
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        userId: session.user.id,
      },
    });
    return NextResponse.json(
      { message: "Category created successfully", category },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
