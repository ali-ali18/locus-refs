"use client";

import { RedditFreeIcons } from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Icon } from "../shared/Icon";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                suppressHydrationWarning
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground rounded-xl [&_svg]:size-5 pr-3"
              />
            }
          >
            <span className="p-1.5 drounded-xl">
              <Icon icon={RedditFreeIcons} className="size-5" />
            </span>
            <span className="text-base">Mind.ly</span>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
