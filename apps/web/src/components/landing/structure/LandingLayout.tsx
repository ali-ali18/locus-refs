import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { BorderDivider } from "../BorderDivider";
import { NodeConnector } from "../NodeConnector";

interface LandingWrapperProps {
  containerClassName?: string;
  children: ReactNode;
  isStriped?: boolean;
  id?: string;
}

export function LandingWrapper({
  containerClassName,
  children,
  isStriped = false,
  id,
}: LandingWrapperProps) {
  return (
    <div
      id={id}
      className={cn(
        "bg-background flex min-w-0 border-border relative size-full",
        containerClassName,
      )}
    >
      <NodeConnector position="left" showOnLg />
      <NodeConnector position="right" showOnLg />
      <BorderDivider variant="shrink" side="left" isStriped={isStriped} />
      <BorderDivider variant="flex" side="left" />
      {children}
      <BorderDivider variant="flex" side="right" />
      <BorderDivider variant="shrink" side="right" isStriped={isStriped} />
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
