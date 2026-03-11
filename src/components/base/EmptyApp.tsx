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

interface EmptyAppProps {
  title: ReactNode;
  description: string;
  icon: IconSvgElement;
  action?: ReactNode;
  className?: string;
  classNameIcon?: string;
}

export function EmptyApp({
  title,
  description,
  icon,
  action,
  className,
  classNameIcon,
}: EmptyAppProps) {
  return (
    <Empty className={cn(className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon icon={icon} className={classNameIcon}/>
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{action}</EmptyContent>
    </Empty>
  );
}
