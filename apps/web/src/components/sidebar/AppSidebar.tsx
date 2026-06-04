"use client";

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
import { NavBase } from "./NavBase";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavBase />
        <NavMain />
        <NavNotes />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
