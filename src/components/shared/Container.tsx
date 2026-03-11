import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
  itemSpacing?: "none" | "sm" | "md" | "lg" | "xl";
  id?: string;
}

export function Container({
  children,
  className,
  as: Component = "div",
  id,
  itemSpacing = "none",
}: Props) {
  const itemSpacingClasses = {
    none: "space-y-0",
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8",
    xl: "space-y-10",
  };
  return (
    <Component
      className={cn(
        "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full my-12",
        itemSpacingClasses[itemSpacing],
        className,
      )}
      id={id}
    >
      {children}
    </Component>
  );
}
