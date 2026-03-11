"use client";

import type { IconSvgElement } from "@hugeicons/react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";

interface NavigationMenuItem {
  icon: IconSvgElement;
  label: string;
  href: string;
}

interface Props {
  className?: string;
  items: NavigationMenuItem[];
}

export function NavigationMenu({ className, items }: Props) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed max-w-md w-full",
        "bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6 md:bottom-16",
        "w-fit px-4 py-3 border rounded-full",
        "bg-background shadow-lg z-50",
        className,
      )}
    >
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const isActive = pathname === item.href 

          return (
            <li key={item.href}>
              <m.div>
                <Link
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full",
                    "text-muted-foreground hover:text-foreground",
                    "transition-all duration-300",
                    isActive && "text-primary bg-secondary/70",
                  )}
                >
                  <Icon icon={item.icon} className="size-5 shrink-0" />
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <m.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="text-sm font-medium overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </m.span>
                    )}
                  </AnimatePresence>
                </Link>
              </m.div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
