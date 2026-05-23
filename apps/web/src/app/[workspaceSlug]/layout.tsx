import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { DashboardLayoutHeader } from "@/components/dashboard/DashboardLayoutHeader";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkspaceNavigationMenu } from "@/components/workspace/WorkspaceNavigationMenu";
import { ChatPanelProvider } from "@/context/chatPanel";
import { WorkspaceProvider } from "@/context/workspace";
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
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WorkspaceProvider
        workspaceId={workspace.id}
        workspaceSlug={workspace.slug}
        workspaceName={workspace.name}
        workspaceLogo={workspace.logo}
      >
        <ChatPanelProvider>
          <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-1 flex-col">
              <DashboardLayoutHeader />
              {children}
            </div>
            <ChatPanel />
            <WorkspaceNavigationMenu />
          </SidebarProvider>
        </ChatPanelProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
}
