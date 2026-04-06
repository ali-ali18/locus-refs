import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ConfigPageLayout } from "@/components/workspace/ConfigPageLayout";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireSession } from "@/server/requireSession";

interface Props {
  params: Promise<{ workspaceSlug: string }>;
}

export default async function ConfigPage({ params }: Props) {
  const { workspaceSlug } = await params;
  const session = await requireSession();

  const org = await prisma.organization.findUnique({
    where: { slug: workspaceSlug },
    select: { id: true },
  });

  if (!org) notFound();

  const result = await auth.api.listMembers({
    query: { organizationId: org.id },
    headers: await headers(),
  });

  const member = result.members.find((m) => m.userId === session.user.id);

  if (member?.role !== "owner" && member?.role !== "admin") {
    redirect(`/${workspaceSlug}`);
  }

  return <ConfigPageLayout />;
}
