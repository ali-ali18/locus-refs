"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { docsNavItems } from "./docs-nav";

export function DocsPageFooterNav() {
  const pathname = usePathname();
  const currentIndex = docsNavItems.findIndex(({ href }) => pathname === href);

  const prev = currentIndex > 0 ? docsNavItems[currentIndex - 1] : null;
  const next =
    currentIndex < docsNavItems.length - 1
      ? docsNavItems[currentIndex + 1]
      : null;

  if (!prev && !next) return null;

  return (
    <div className="flex items-center justify-between mt-12 pt-6 border-t border-border gap-4">
      {prev ? (
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={prev.href} />}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={12} strokeWidth={2} />
          {prev.label}
        </Button>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={next.href} />}
        >
          {next.label}
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2} />
        </Button>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
