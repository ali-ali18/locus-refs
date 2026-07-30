"use client";

import type { ReactNode } from "react";
import { AgentWorkspace } from "@/components/chat/AgentWorkspace";
import { DashboardLayoutHeader } from "@/components/dashboard/DashboardLayoutHeader";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { useChatPanel } from "@/context/chatPanel";
import { cn } from "@/lib/utils";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { open } = useChatPanel();

  return (
    <>
      <AppSidebar />
      <SidebarInset className="flex h-svh max-h-svh min-w-0 flex-col overflow-hidden">
        {/* Mantém a página montada sob o Agent para tools client (Yjs) da nota aberta. */}
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden",
            open && "hidden",
          )}
          aria-hidden={open}
        >
          <DashboardLayoutHeader />
          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
            {children}
          </div>
        </div>
        {open ? <AgentWorkspace /> : null}
      </SidebarInset>
    </>
  );
}
