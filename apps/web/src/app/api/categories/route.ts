import { type NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

export async function GET(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  const categories = await prisma.category.findMany({
    where: { workspaceId },
    orderBy: { name: "asc" },
    include: { _count: { select: { resources: true } } },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;

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
        workspaceId,
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
