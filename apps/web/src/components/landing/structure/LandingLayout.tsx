import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { BorderDivider } from "../BorderDivider";
import { NodeConnector } from "../NodeConnector";

interface LandingWrapperProps {
  containerClassName?: string;
  children: ReactNode;
  isStriped?: boolean;
}

export function LandingWrapper({
  containerClassName,
  children,
  isStriped = false,
}: LandingWrapperProps) {
  return (
    <div
      className={cn(
        "bg-background flex min-w-0 border-border relative size-full",
        containerClassName,
      )}
    >
      <NodeConnector position="left" showOnLg />
      <NodeConnector position="right" showOnLg />
      <BorderDivider variant="shrink" side="left" />
      <BorderDivider variant="flex" side="left" isStriped={isStriped} />
      {children}
      <BorderDivider variant="flex" side="right" isStriped={isStriped} />
      <BorderDivider variant="shrink" side="right" />
    </div>
  );
}

export const baseLandingContentClass =
  "w-full max-w-5xl flex-7 pl-3 lg:pl-3.5 pr-3 relative isolate z-2 [--node-horizontal-offset:-3.5px]";

interface LandingContentProps {
  contentClassName?: string;
  className?: string;
  children: ReactNode;
  as?: ElementType;
}

export function LandingContent({
  contentClassName,
  className,
  children,
  as: Component = "main",
}: LandingContentProps) {
  return (
    <Component
      className={cn(baseLandingContentClass, contentClassName, className)}
    >
      <NodeConnector position="left" />
      <NodeConnector position="right" />
      {children}
    </Component>
  );
}
