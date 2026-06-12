"use client";

import dynamic from "next/dynamic";
import { NavBoards } from "@/components/sidebar/NavBoards";
import { NavMain } from "@/components/sidebar/NavMain";
import { NavNotes } from "@/components/sidebar/NavNotes";
import { NavUser } from "@/components/sidebar/NavUser";
import { TeamSwitcher } from "@/components/sidebar/TeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebarTab } from "@/context/sidebarTab";
import { NavBase } from "./NavBase";

const SidebarNavTabs = dynamic(
  () => import("./SidebarNavTabs").then((m) => m.SidebarNavTabs),
  {
    ssr: false,
    loading: () => <Skeleton className="mx-2 my-1 h-9" />,
  },
);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeTab } = useSidebarTab();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavTabs />
        {activeTab === "pages" && <NavBase />}
        {activeTab === "resources" && <NavMain />}
        {activeTab === "notes" && <NavNotes />}
        {activeTab === "boards" && <NavBoards />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
