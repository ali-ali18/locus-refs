"use client";

import { Config, UserListFreeIcons } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { WorkspaceConfigClient } from "@/components/workspace/WorkspaceConfigClient";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { ConfigNavCarousel } from "./ConfigNavCarousel";
import { WorkspaceUserList } from "./config/WorkspaceUserList";

interface NavItem {
  id: string;
  label: string;
  icon: IconSvgElement;
  content: ReactNode;
}

const navItems: NavItem[] = [
  {
    id: "settings",
    label: "Workspace",
    icon: Config,
    content: <WorkspaceConfigClient />,
  },
  {
    id: "members",
    label: "Usuários",
    icon: UserListFreeIcons,
    content: <WorkspaceUserList />,
  },
];

export function ConfigPageLayout() {
  const [activeId, setActiveId] = useState(navItems[0].id);
  const activeItem =
    navItems.find((item) => item.id === activeId) ?? navItems[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full my-12">
      <div className="md:hidden">
        <ConfigNavCarousel
          items={navItems}
          activeId={activeId}
          onSelect={setActiveId}
        />
        <div className="mt-6">{activeItem.content}</div>
      </div>

      <div className="hidden md:grid grid-cols-[200px_1fr] gap-10">
        <nav className="flex flex-col gap-1">
          {navItems.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveId(id)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-left transition-colors",
                activeId === id
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <Icon icon={icon} />
              {label}
            </button>
          ))}
        </nav>
        <div>{activeItem.content}</div>
      </div>
    </div>
  );
}
