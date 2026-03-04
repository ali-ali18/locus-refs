import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Props {
  trigger: ReactNode;
  className?: string;
  children: ReactNode;
  contentClassName?: string;
}

export function DropdownMenuApp({
  trigger,
  className,
  children,
  contentClassName,
}: Props) {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger className={cn("group outline-none hover:bg-muted rounded-full transition-all duration-300", className)}>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className={cn(contentClassName)}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
