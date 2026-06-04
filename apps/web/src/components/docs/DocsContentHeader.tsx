"use client";

import { usePathname } from "next/navigation";
import { getDocsSection } from "./docs-sections";

export function DocsContentHeader() {
  const pathname = usePathname();
  const section = getDocsSection(pathname);

  if (!section) return null;

  return (
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
      {section.label}
    </p>
  );
}
