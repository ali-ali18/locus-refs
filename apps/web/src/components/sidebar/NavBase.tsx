"use client";

import {
  DashboardSquare01Icon,
  Folder01FreeIcons,
  Home01Icon,
  Note01FreeIcons,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/context/workspace";
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
  const pathname = usePathname();

  const links = [
    { href: `/${workspaceSlug}`, icon: Home01Icon, label: "Inicio" },
    { href: `/${workspaceSlug}/notes`, icon: Note01FreeIcons, label: "Notas" },
    {
      href: `/${workspaceSlug}/collections`,
      icon: Folder01FreeIcons,
      label: "Coleções",
    },
    {
      href: `/${workspaceSlug}/boards`,
      icon: DashboardSquare01Icon,
      label: "Boards",
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Paginas</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
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
