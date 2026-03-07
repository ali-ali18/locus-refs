import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
  id?: string;
}

export function Container({
  children,
  className,
  as: Component = "div",
  id,
}: Props) {
  return (
    <Component
      className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full my-12", className)}
      id={id}
    >
      {children}
    </Component>
  );
}
