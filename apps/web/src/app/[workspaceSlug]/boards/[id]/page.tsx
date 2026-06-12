import { notFound, redirect } from "next/navigation";
import { WrapperBoard } from "@/components/boards/WrapperBoard";
import prisma from "@/lib/prisma";
import { requireSession } from "@/server/requireSession";

interface Props {
  params: Promise<{ id: string; workspaceSlug: string }>;
}

export default async function BoardPage({ params }: Props) {
  const { id, workspaceSlug } = await params;
  const session = await requireSession();

  const workspace = await prisma.organization.findUnique({
    where: { slug: workspaceSlug },
  });
  if (!workspace) notFound();

  const member = await prisma.member.findFirst({
    where: { organizationId: workspace.id, userId: session.user.id },
  });
  if (!member) redirect("/login");

  return <WrapperBoard boardId={id} workspaceId={workspace.id} />;
}
