"use client";

import { Menu01FreeIcons } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LandingContent,
  LandingWrapper,
} from "../landing/structure/LandingLayout";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { docsNavGroups, docsNavItems } from "./docs-nav";
import { Icon } from "../shared/Icon";

export function DocsMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current = docsNavItems.find(({ href }) => pathname === href);

  return (
    <LandingWrapper containerClassName="md:hidden sticky top-[57px] z-10 border-b">
      <LandingContent as="div" contentClassName="flex items-center gap-3 py-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon icon={Menu01FreeIcons} />
          <span>Menu</span>
        </button>

        {current && (
          <>
            <span className="text-border">/</span>
            <span className="text-sm font-medium text-foreground">
              {current.label}
            </span>
          </>
        )}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="left"
            showCloseButton={false}
            className="p-0 gap-0 mt-14"
          >
            <SheetHeader className="border-b px-4 py-3">
              <SheetTitle className="font-semibold text-foreground">
                Documentação
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-6 p-4 overflow-y-auto">
              {docsNavGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-sm font-bold text-foreground mb-2 px-3">
                    {group.label}
                  </p>
                  <div className="flex flex-col">
                    {group.items.map(({ href, label }) => {
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-sm transition-colors",
                            isActive
                              ? "bg-secondary text-secondary-foreground font-medium"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </LandingContent>
    </LandingWrapper>
  );
}
