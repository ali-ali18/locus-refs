import { type NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import prisma from "@/lib/prisma";
import { requireWorkspacePermission } from "@/server/permissions";

export async function GET(request: NextRequest) {
  const auth = await requireWorkspacePermission(request, {
    collection: ["read"],
  });
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  try {
    const collections = await prisma.collection.findMany({
      where: { workspaceId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(collections);
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to get collections" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireWorkspacePermission(request, {
    collection: ["create"],
  });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;

  const body = await request.json();
  const { name, description, color, isNoteCollection } = body;

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
        workspaceId,
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(isNoteCollection !== undefined && { isNoteCollection }),
      },
    });
    return NextResponse.json(
      { message: "Collection created successfully", collection },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { error: "Failed to create collection", details: String(error) },
      { status: 500 },
    );
  }
}
