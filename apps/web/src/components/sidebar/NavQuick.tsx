"use client";

import {
  BubbleChatIcon,
  DashboardSquare01Icon,
  Folder01FreeIcons,
  Home01Icon,
  KanbanIcon,
  Note01FreeIcons,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useChatPanel } from "@/context/chatPanel";
import { useWorkspace } from "@/context/workspace";

export function NavQuick() {
  const { workspaceSlug } = useWorkspace();
  const pathname = usePathname();
  const { open: agentOpen, toggle: toggleChat } = useChatPanel();

  const links = [
    {
      href: `/${workspaceSlug}`,
      icon: Home01Icon,
      label: "Início",
      match: "exact" as const,
    },
    {
      href: `/${workspaceSlug}/notes`,
      icon: Note01FreeIcons,
      label: "Notas",
      match: "prefix" as const,
    },
    {
      href: `/${workspaceSlug}/collections`,
      icon: Folder01FreeIcons,
      label: "Coleções",
      match: "prefix" as const,
    },
    {
      href: `/${workspaceSlug}/boards`,
      icon: DashboardSquare01Icon,
      label: "Boards",
      match: "prefix" as const,
    },
    {
      href: `/${workspaceSlug}/kanban`,
      icon: KanbanIcon,
      label: "Kanban",
      match: "prefix" as const,
    },
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip="Agent"
          onClick={toggleChat}
          isActive={agentOpen}
        >
          <Icon icon={BubbleChatIcon} />
          <span>Agent</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {links.map((link) => {
        const isActive =
          link.match === "exact"
            ? pathname === link.href
            : pathname.startsWith(link.href);

        return (
          <SidebarMenuItem key={link.href}>
            <SidebarMenuButton
              suppressHydrationWarning
              tooltip={link.label}
              isActive={isActive}
              render={<Link href={link.href} />}
            >
              <Icon icon={link.icon} />
              <span>{link.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
