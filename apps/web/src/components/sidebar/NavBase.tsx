"use client";

import {
  Folder01FreeIcons,
  Home01Icon,
  Note01FreeIcons,
  Setting07Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/context/workspace";
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";
import { Icon } from "../shared/Icon";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

export function NavBase() {
  const { workspaceSlug } = useWorkspace();
  const { currentMember } = useWorkspaceMembers();
  const canSeeSettings =
    currentMember?.role === "admin" || currentMember?.role === "owner";
  const pathname = usePathname();

  const links = [
    {
      href: `/${workspaceSlug}`,
      icon: Home01Icon,
      label: "Inicio",
    },
    {
      href: `/${workspaceSlug}/notes`,
      icon: Note01FreeIcons,
      label: "Notas",
      className: "group-data-[collapsible=icon]:hidden",
    },
    {
      href: `/${workspaceSlug}/collections`,
      icon: Folder01FreeIcons,
      label: "Coleções",
      className: "group-data-[collapsible=icon]:hidden",
    },
    {
      href: `/${workspaceSlug}/config`,
      icon: Setting07Icon,
      label: "Configuração do workspace",
      rule: canSeeSettings,
      className: "group-data-[collapsible=icon]:hidden",
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Paginas</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {links
            .filter((link) => link.rule !== false)
            .map((link) => (
              <SidebarMenuItem key={link.href} className={link.className}>
                <SidebarMenuButton
                  suppressHydrationWarning
                  tooltip={link.label}
                  isActive={
                    link.href === `/${workspaceSlug}`
                      ? pathname === link.href
                      : pathname.startsWith(link.href)
                  }
                  render={<Link href={link.href} />}
                >
                  <Icon icon={link.icon} />
                  {link.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
