"use client";

import { CommandPaletteTrigger } from "@/components/command-palette/CommandPalette";
import { NavBoards } from "@/components/sidebar/NavBoards";
import { NavMain } from "@/components/sidebar/NavMain";
import { NavNotes } from "@/components/sidebar/NavNotes";
import { NavQuick } from "@/components/sidebar/NavQuick";
import { NavUser } from "@/components/sidebar/NavUser";
import { TeamSwitcher } from "@/components/sidebar/TeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
        <CommandPaletteTrigger />
        <NavQuick />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <div className="flex flex-col gap-0 group-data-[collapsible=icon]:hidden">
          <NavNotes />
          <NavMain />
          <NavBoards />
        </div>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
