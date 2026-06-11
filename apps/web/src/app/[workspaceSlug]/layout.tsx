import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsDialog } from "@/components/workspace/SettingsDialog";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { ChatPanelProvider } from "@/context/chatPanel";
import { NoteEditorProvider } from "@/context/noteEditor";
import { SettingsDialogProvider } from "@/context/settingsDialog";
import { SidebarTabProvider } from "@/context/sidebarTab";
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
        <NoteEditorProvider>
          <ChatPanelProvider>
            <SettingsDialogProvider>
              <SidebarTabProvider>
                <SidebarProvider>
                  <WorkspaceShell>{children}</WorkspaceShell>
                  <ChatPanel />
                  <SettingsDialog />
                </SidebarProvider>
              </SidebarTabProvider>
            </SettingsDialogProvider>
          </ChatPanelProvider>
        </NoteEditorProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
}
