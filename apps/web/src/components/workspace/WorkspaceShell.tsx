"use client";

import type { ReactNode } from "react";
import { DashboardLayoutHeader } from "@/components/dashboard/DashboardLayoutHeader";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <DashboardLayoutHeader />
        {children}
      </SidebarInset>
    </>
  );
}
