import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireWorkspacePermission } from "@/server/permissions";
import { deleteObjects } from "@/server/upload";

export async function DELETE(request: NextRequest) {
  const access = await requireWorkspacePermission(request, {
    organization: ["delete"],
  });
  if ("error" in access) return access.error;
  const { workspaceId } = access;

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
