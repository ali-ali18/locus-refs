"use client";

import {
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
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Paginas</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map((link) => (
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
