import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionGuard } from "@/components/workspace/SessionGuard";
import { SettingsDialog } from "@/components/workspace/SettingsDialog";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { AgentSessionProvider } from "@/context/agentSession";
import { ChatPanelProvider } from "@/context/chatPanel";
import { CommandPaletteProvider } from "@/context/commandPalette";
import { NoteEditorProvider } from "@/context/noteEditor";
import { NoteTrailProvider } from "@/context/noteTrail";
import { SettingsDialogProvider } from "@/context/settingsDialog";
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
          <NoteTrailProvider>
            <ChatPanelProvider>
              <AgentSessionProvider>
                <SettingsDialogProvider>
                  <CommandPaletteProvider>
                    <SidebarProvider>
                      <SessionGuard />
                      <WorkspaceShell>{children}</WorkspaceShell>
                      <SettingsDialog />
                      <CommandPalette />
                    </SidebarProvider>
                  </CommandPaletteProvider>
                </SettingsDialogProvider>
              </AgentSessionProvider>
            </ChatPanelProvider>
          </NoteTrailProvider>
        </NoteEditorProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
}
