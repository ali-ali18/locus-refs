"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BreadcrumbRenderer } from "@/components/breadcrumb/BreadcrumbRenderer";
import {
  NoteTrailBreadcrumb,
  NoteTrailSync,
  useHasActiveNoteTrail,
} from "@/components/breadcrumb/NoteTrailBreadcrumb";
import { NavActions } from "@/components/sidebar/NavActions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveBreadcrumb } from "@/lib/breadcrumb/actions/resolve-breadcrumb";
import type { BreadcrumbItem } from "@/lib/breadcrumb/route-resolvers";

function HeaderBreadcrumb() {
  const pathname = usePathname();
  const hasNoteTrail = useHasActiveNoteTrail();
  const [items, setItems] = useState<BreadcrumbItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hasNoteTrail) {
      setIsLoading(false);
      return;
    }

    async function loadBreadcrumb() {
      setIsLoading(true);
      try {
        const resolved = await resolveBreadcrumb(pathname);
        setItems(resolved);
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    }

    void loadBreadcrumb();
  }, [pathname, hasNoteTrail]);

  if (hasNoteTrail) {
    return <NoteTrailBreadcrumb />;
  }

  if (isLoading) {
    return <Skeleton className="h-4 w-32" />;
  }

  return <BreadcrumbRenderer items={items} />;
}

export function DashboardLayoutHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="-ml-1" />
        <NoteTrailSync />
        <HeaderBreadcrumb />
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2 px-3">
        <NavActions />
      </div>
    </header>
  );
}
