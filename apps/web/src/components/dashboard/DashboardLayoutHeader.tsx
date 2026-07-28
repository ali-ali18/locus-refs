"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BreadcrumbRenderer } from "@/components/breadcrumb/BreadcrumbRenderer";
import { NavActions } from "@/components/sidebar/NavActions";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveBreadcrumb } from "@/lib/breadcrumb/actions/resolve-breadcrumb";
import type { BreadcrumbItem } from "@/lib/breadcrumb/route-resolvers";

export function DashboardLayoutHeader() {
  const pathname = usePathname();
  const [items, setItems] = useState<BreadcrumbItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    loadBreadcrumb();
  }, [pathname]);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="-ml-1" />
        {isLoading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <BreadcrumbRenderer items={items} />
        )}
      </div>
      <div className="ml-auto px-3">
        <NavActions />
      </div>
    </header>
  );
}
