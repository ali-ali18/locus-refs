"use client";

import {
  BubbleChatIcon,
  Moon02Icon,
  MoreVerticalIcon,
  SidebarLeftIcon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BreadcrumbRenderer } from "@/components/breadcrumb/BreadcrumbRenderer";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatPanel } from "@/context/chatPanel";
import { useIsMobile } from "@/hook/use-mobile";
import { resolveBreadcrumb } from "@/lib/breadcrumb/actions/resolve-breadcrumb";
import type { BreadcrumbItem } from "@/lib/breadcrumb/route-resolvers";
import { cn } from "@/lib/utils";
import { ButtonChatPanel } from "../chat/ButtonChatPanel";
import { Icon } from "../shared/Icon";
import { ButtonTheme } from "../shared/ToggleButton";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function DashboardLayoutHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [items, setItems] = useState<BreadcrumbItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { toggle: toggleChat } = useChatPanel();
  const { theme, setTheme } = useTheme();

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
        "flex items-center justify-between gap-2 border-b px-1.5 py-2.5 transition-[padding] duration-300",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
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

      <div className="flex shrink-0 items-center gap-1">
        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" rounded="xl" />}
            >
              <Icon icon={MoreVerticalIcon} className="size-4.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className={"w-40"}>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Interações</DropdownMenuLabel>
                <DropdownMenuItem onClick={toggleChat}>
                  <Icon icon={BubbleChatIcon} />
                  Assistente IA
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  <Icon icon={theme === "dark" ? Moon02Icon : Sun03Icon} />
                  {theme === "dark" ? "Modo claro" : "Modo escuro"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <ButtonChatPanel />
            <ButtonTheme />
          </>
        )}
      </div>
    </header>
  );
}
