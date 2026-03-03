import type { IconSvgElement } from "@hugeicons/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

interface EmpetyAppProps {
  title: string;
  description: string;
  icon: IconSvgElement;
  action?: ReactNode;
  className?: string;
}

export function EmpetyApp({
  title,
  description,
  icon,
  action,
  className,
}: EmpetyAppProps) {
  return (
    <Empty className={cn(className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon icon={icon} />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{action}</EmptyContent>
    </Empty>
  );
}
