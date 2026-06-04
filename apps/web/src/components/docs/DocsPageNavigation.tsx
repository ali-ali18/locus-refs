"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { docsNavItems } from "./docs-nav";
import { useCopyPageContent } from "./use-copy-page-content";

export function DocsPageNavigation() {
  const pathname = usePathname();
  const { copied, copy } = useCopyPageContent();

  const currentIndex = docsNavItems.findIndex(({ href }) => pathname === href);

  const prev = currentIndex > 0 ? docsNavItems[currentIndex - 1] : null;
  const next =
    currentIndex < docsNavItems.length - 1
      ? docsNavItems[currentIndex + 1]
      : null;

  return (
    <div className="flex items-center gap-1 shrink-0">
      <Button
        variant="outline"
        size="icon-sm"
        title="Copiar conteúdo"
        onClick={copy}
      >
        <HugeiconsIcon
          icon={copied ? Tick02Icon : Copy01Icon}
          size={16}
          strokeWidth={2}
        />
      </Button>

      {prev ? (
        <Button
          variant="outline"
          size="icon-sm"
          title={prev.label}
          nativeButton={false}
          render={<Link href={prev.href} />}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
        </Button>
      ) : (
        <div className="size-8" />
      )}
      {next ? (
        <Button
          variant="outline"
          size="icon-sm"
          title={next.label}
          nativeButton={false}
          render={<Link href={next.href} />}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
        </Button>
      ) : (
        <div className="size-8" />
      )}
    </div>
  );
}
