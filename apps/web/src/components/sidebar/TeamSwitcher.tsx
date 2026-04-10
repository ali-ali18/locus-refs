"use client";

import { Plus, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useWorkspace } from "@/context/workspace";
import { useIsMobile } from "@/hook/use-mobile";
import { authClient } from "@/lib/auth-client";
import { Icon } from "../shared/Icon";
import { CreateWorkSpace } from "./CreateWorkSpace";
import { WorkspaceLogo } from "./WorkspaceLogo";

export function TeamSwitcher() {
  const [open, setOpen] = useState(false);

  const isMobile = useIsMobile();
  const { data: organizations } = authClient.useListOrganizations();
  const { workspaceSlug } = useWorkspace();

  const currentWorkspace = organizations?.find(
    (org) => org.slug === workspaceSlug,
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                suppressHydrationWarning
                size="lg"
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground rounded-xl [&_svg]:size-4.5 pr-3"
              />
            }
          >
            <WorkspaceLogo logo={currentWorkspace?.logo} fallback="brushIcon" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {currentWorkspace?.name ?? "Workspace não encontrado"}
              </span>
            </div>
            <Icon icon={UnfoldMoreIcon} className="ml-auto" />{" "}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={"min-w-60 rounded-xl"}
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Seus Workspaces</DropdownMenuLabel>
              {organizations
                ? organizations.map((item, index) => (
                    <DropdownMenuItem
                      key={item.slug}
                      className={"gap-2 p-2"}
                      render={<Link href={`/${item.slug}`}></Link>}
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border">
                        <WorkspaceLogo
                          logo={item.logo}
                          fallback="drawing"
                          className="size-3.5 shrink"
                          withBackground={false}
                        />
                      </div>
                      {item.name}
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))
                : null}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => setOpen(!open)}
                disabled={organizations?.length === 10}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Icon icon={Plus} className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Criar um novo workspace
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <CreateWorkSpace open={open} onOpenChange={setOpen} />
    </SidebarMenu>
  );
}
