import type { ReactNode } from "react";
import { DocsContentHeader } from "@/components/docs/DocsContentHeader";
import { DocsMobileNav } from "@/components/docs/DocsMobileNav";
import { DocsPageFooterNav } from "@/components/docs/DocsPageFooterNav";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsTableOfContents } from "@/components/docs/DocsTableOfContents";
import { ContainerHeader } from "@/components/landing/Header";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ContainerHeader />
      <DocsMobileNav />
      <div className="flex-1 border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-8">
          <DocsSidebar />
          <article className="flex-1 min-w-0 py-8">
            <DocsContentHeader />
            {children}
            <DocsPageFooterNav />
          </article>
          <DocsTableOfContents />
        </div>
      </div>
    </div>
  );
}
