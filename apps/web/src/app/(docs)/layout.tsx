import type { ReactNode } from "react";
import { DocsContentHeader } from "@/components/docs/DocsContentHeader";
import { DocsMobileNav } from "@/components/docs/DocsMobileNav";
import { DocsPageFooterNav } from "@/components/docs/DocsPageFooterNav";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { ContainerHeader } from "@/components/landing/Header";
import {
  LandingContent,
  LandingWrapper,
} from "@/components/landing/structure/LandingLayout";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ContainerHeader />
      <DocsMobileNav />
      <LandingWrapper containerClassName="border-b">
        <LandingContent as="div" contentClassName="flex gap-8" className="min-w-0">
          <DocsSidebar />
          <article className="flex-1 min-w-0 py-8 max-w-3xl">
            <DocsContentHeader />
            {children}
            <DocsPageFooterNav />
          </article>
        </LandingContent>
      </LandingWrapper>
    </div>
  );
}
