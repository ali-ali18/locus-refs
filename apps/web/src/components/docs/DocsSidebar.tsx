"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docsNavGroups } from "./docs-nav";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-52 shrink-0 py-8 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto gap-6">
      {docsNavGroups.map((group) => (
        <div key={group.label}>
          <p className="text-sm font-bold text-foreground mb-2 px-3">
            {group.label}
          </p>
          <nav className="flex flex-col">
            {group.items.map(({ href, label }) => {
              const isActive =
                pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
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
          </nav>
        </div>
      ))}
    </aside>
  );
}
