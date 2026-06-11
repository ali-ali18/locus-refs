"use client";

import type { ReactNode } from "react";
import { DashboardLayoutHeader } from "@/components/dashboard/DashboardLayoutHeader";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  return (
    <>
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardLayoutHeader />
        {children}
      </div>
    </>
  );
}
