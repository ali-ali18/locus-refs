import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";
import { deleteObjects } from "@/server/upload";

export async function DELETE(request: NextRequest) {
  const access = await requireWorkspaceAccess(request);
  if ("error" in access) return access.error;
  const { workspaceId, session } = access;

  const member = await prisma.member.findFirst({
    where: { organizationId: workspaceId, userId: session.user.id },
    select: { role: true },
  });

  if (member?.role !== "owner") {
    return NextResponse.json(
      { error: "Apenas o owner pode deletar o workspace", code: "FORBIDDEN" },
      { status: 403 },
    );
  }

  const org = await prisma.organization.findUnique({
    where: { id: workspaceId },
    select: { logo: true },
  });

  await auth.api.deleteOrganization({
    body: { organizationId: workspaceId },
    headers: request.headers,
  });

  if (org?.logo?.startsWith("/storage/")) {
    const key = org.logo.replace(/^\/storage\//, "");
    deleteObjects([key]).catch(console.error);
  }

  return NextResponse.json(
    { message: "Workspace deletado com sucesso" },
    { status: 200 },
  );
}
