import { notFound, redirect } from "next/navigation";
import { WrapperKanban } from "@/components/kanban/WrapperKanban";
import prisma from "@/lib/prisma";
import { requireSession } from "@/server/requireSession";

interface Props {
  params: Promise<{ id: string; workspaceSlug: string }>;
}

export default async function KanbanBoardPage({ params }: Props) {
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

  const board = await prisma.kanbanBoard.findFirst({
    where: { id, workspaceId: workspace.id, deletedAt: null },
    select: { id: true },
  });
  if (!board) notFound();

  return <WrapperKanban boardId={id} />;
}
