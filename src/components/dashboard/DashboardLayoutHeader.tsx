"use client";

import { SidebarLeftIcon } from "@hugeicons/core-free-icons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BreadcrumbRenderer } from "@/components/breadcrumb/BreadcrumbRenderer";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveBreadcrumb } from "@/lib/breadcrumb/actions/resolve-breadcrumb";
import type { BreadcrumbItem } from "@/lib/breadcrumb/route-resolvers";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { ButtonTheme } from "../shared/ToggleButton";
import { Button } from "../ui/button";

export function DashboardLayoutHeader() {
  const { toggleSidebar } = useSidebar();
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
    <header
      className={cn(
        "flex py-2.5 items-center justify-between gap-2 border-b px-1.5 transition-[padding] duration-300",
      )}
    >
      <div className="flex items-center justify-center gap-1.5">
        <Button
          size={"icon-sm"}
          rounded={"xl"}
          onClick={toggleSidebar}
          variant={"ghost"}
        >
          <Icon icon={SidebarLeftIcon} className="size-4.5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        {isLoading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <BreadcrumbRenderer items={items} />
        )}
      </div>

      <ButtonTheme />
    </header>
  );
}
