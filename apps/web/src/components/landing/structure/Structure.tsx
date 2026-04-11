import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ContainerLanding({ children }: { children: ReactNode }) {
  return <main className="min-h-screen space-y-px bg-border">{children}</main>;
}

type SideRounded = "top" | "bottom" | "both" | "none";

const sideRoundedMap: Record<"left" | "right", Record<SideRounded, string>> = {
  left: {
    top: "rounded-tr",
    bottom: "rounded-br",
    both: "rounded-r",
    none: "",
  },
  right: {
    top: "rounded-tl",
    bottom: "rounded-bl",
    both: "rounded-l",
    none: "",
  },
};

interface StructureProps {
  children: ReactNode;
  as?: "div" | "main" | "section" | "header";
  className?: string;
  classNameContent?: string;
  sideRounded?: SideRounded;
  roundedContent?: string;
}

export function Structure({
  children,
  className,
  classNameContent,
  as: Component = "div",
  sideRounded = "both",
  roundedContent,
}: StructureProps) {
  return (
    <Component className={cn("flex gap-px", className)}>
      <div className={cn("hidden md:block md:flex-1 bg-background", sideRoundedMap.left[sideRounded])} />
      <div className={cn("flex-4 min-w-0 bg-background relative", roundedContent, classNameContent)}>
        {children}
      </div>
      <div className={cn("hidden md:block md:flex-1 bg-background", sideRoundedMap.right[sideRounded])} />
    </Component>
  );
}
