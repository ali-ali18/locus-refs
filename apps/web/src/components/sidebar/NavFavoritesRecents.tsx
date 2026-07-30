"use client";

import { Clock01Icon, Note01FreeIcons, StarIcon } from "@hugeicons/core-free-icons";
import type { NotePinItem } from "@refstash/shared";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/context/workspace";
import { useNotePins } from "@/hook/notes/useNotePins";
import { resolveIcon } from "@/lib/icons";

function PinList({ items }: { items: NotePinItem[] }) {
  const { workspaceSlug } = useWorkspace();
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const href = `/${workspaceSlug}/notes/${item.id}`;
        return (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              suppressHydrationWarning
              className="rounded-xl"
              isActive={pathname === href}
              tooltip={item.title}
              render={<Link href={href} />}
            >
              <Icon
                icon={item.icon ? resolveIcon(item.icon) : Note01FreeIcons}
              />
              <span className="truncate">{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function NavFavoritesRecents() {
  const { data, isLoading } = useNotePins();

  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {["a", "b", "c"].map((k) => (
          <Skeleton key={k} className="h-8 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const favorites = data?.favorites ?? [];
  const recents = data?.recents ?? [];

  if (favorites.length === 0 && recents.length === 0) {
    return null;
  }

  return (
    <>
      {favorites.length > 0 ? (
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-1.5">
            <Icon icon={StarIcon} className="size-3.5" />
            Favoritos
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <PinList items={favorites} />
          </SidebarGroupContent>
        </SidebarGroup>
      ) : null}

      {recents.length > 0 ? (
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-1.5">
            <Icon icon={Clock01Icon} className="size-3.5" />
            Recentes
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <PinList items={recents} />
          </SidebarGroupContent>
        </SidebarGroup>
      ) : null}
    </>
  );
}
