"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { AgentWorkspace } from "@/components/chat/AgentWorkspace";
import { DashboardLayoutHeader } from "@/components/dashboard/DashboardLayoutHeader";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { useChatPanel } from "@/context/chatPanel";
import { cn } from "@/lib/utils";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { open: agentOpen } = useChatPanel();
  const { open: sidebarOpen, setOpen: setSidebarOpen, setOpenMobile } =
    useSidebar();
  const sidebarBeforeAgentRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (agentOpen) {
      if (sidebarBeforeAgentRef.current === null) {
        sidebarBeforeAgentRef.current = sidebarOpen;
      }
      if (sidebarOpen) setSidebarOpen(false);
      setOpenMobile(false);
      return;
    }

    if (sidebarBeforeAgentRef.current !== null) {
      setSidebarOpen(sidebarBeforeAgentRef.current);
      sidebarBeforeAgentRef.current = null;
    }
  }, [agentOpen, setOpenMobile, setSidebarOpen, sidebarOpen]);

  return (
    <>
      <AppSidebar />
      <SidebarInset className="flex h-svh max-h-svh min-w-0 flex-col overflow-hidden">
        {/* Mantém a página montada sob o Agent para tools client (Yjs) da nota aberta. */}
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden",
            agentOpen && "hidden",
          )}
          aria-hidden={agentOpen}
        >
          <DashboardLayoutHeader />
          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
            {children}
          </div>
        </div>
        {agentOpen ? <AgentWorkspace /> : null}
      </SidebarInset>
    </>
  );
}
