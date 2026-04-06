import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { WorkspaceProvider } from "@/context/workspace";
import { WorkspaceNavigationMenu } from "@/components/workspace/WorkspaceNavigationMenu";
import { DashboardLayoutHeader } from "@/components/dashboard/DashboardLayoutHeader";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import prisma from "@/lib/prisma";
import { requireSession } from "@/server/requireSession";

interface Props {
  children: ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}

export default async function WorkspaceLayout({ children, params }: Props) {
  const { workspaceSlug } = await params;
  const session = await requireSession();

  const workspace = await prisma.organization.findUnique({
    where: { slug: workspaceSlug },
  });

  if (!workspace) notFound();

  const member = await prisma.member.findFirst({
    where: { organizationId: workspace.id, userId: session.user.id },
  });

  if (!member) redirect("/login");

  return (
    <WorkspaceProvider
      workspaceId={workspace.id}
      workspaceSlug={workspace.slug}
      workspaceName={workspace.name}
      workspaceLogo={workspace.logo}
    >
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardLayoutHeader />
          {children}
        </div>
        <WorkspaceNavigationMenu />
      </SidebarProvider>
    </WorkspaceProvider>
  );
}
