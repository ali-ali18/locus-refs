import type { IconSvgElement } from "@hugeicons/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DropdownMenuAppItem {
  label: string;
  icon?: IconSvgElement;
  onClick?: () => void;
  className?: string;
  href?: string;
}

interface Props {
  trigger: ReactNode;
  className?: string;
  contentClassName?: string;
  items?: DropdownMenuAppItem[];
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export function DropdownMenuApp({
  trigger,
  className,
  items,
  contentClassName,
  children,
  header,
  footer,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        suppressHydrationWarning
        className={cn(
          "group outline-none hover:bg-muted rounded-full transition-all duration-300 ",
          className,
        )}
      >
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("rounded-xl", contentClassName)}>
        {header}
        {children}
        {items?.map((item) => {
          const content = (
            <>
              {item.icon && <Icon icon={item.icon} className="size-4" />}
              {item.label}
            </>
          );

          if (item.href) {
            return (
              <DropdownMenuItem
                key={item.label}
                className={cn("rounded-xl", item.className)}
                onClick={item.onClick}
                render={<Link href={item.href}>{content}</Link>}
                suppressHydrationWarning
              />
            );
          }

          return (
            <DropdownMenuItem
              key={item.label}
              className={cn("rounded-xl", item.className)}
              onClick={item.onClick}
            >
              {content}
            </DropdownMenuItem>
          );
        })}
        {footer}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
