import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/server/requireSession";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
