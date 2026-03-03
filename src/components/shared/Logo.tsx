import { ClaudeFreeIcons } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

interface Props {
  className?: string;
  href?: string;
}

export function Logo({ className, href }: Props) {
  const LogoIcon = (
    <Icon icon={ClaudeFreeIcons} className={cn("size-8", className)} />
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn("hover:opacity-80 transition-opacity", className)}
      >
        {LogoIcon}
      </Link>
    );
  }

  return LogoIcon;
}
