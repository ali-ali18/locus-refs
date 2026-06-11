"use client";

import { Menu01FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function DocsTableOfContents() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      const article = document.querySelector("article");
      if (!article) return;

      const elements = article.querySelectorAll("h2[id], h3[id]");
      const items: Heading[] = Array.from(elements).map((el) => ({
        id: el.id,
        text: el.textContent?.trim() ?? "",
        level: (el.tagName === "H2" ? 2 : 3) as 2 | 3,
      }));

      setHeadings(items);
      setActiveIds(new Set());
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (headings.length === 0) return;

    function onScroll() {
      // Find the index of the last heading that scrolled past the threshold
      let activeIndex = -1;
      headings.forEach(({ id }, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) activeIndex = i;
      });

      // At the bottom: also include headings visible in the viewport
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 16;

      const ids = new Set<string>();

      // Fill all headings from 0 up to activeIndex (cumulative progress)
      for (let i = 0; i <= activeIndex; i++) ids.add(headings[i].id);

      // At bottom, pull in anything still visible on screen
      if (atBottom) {
        for (const { id } of headings) {
          const el = document.getElementById(id);
          if (el) {
            const top = el.getBoundingClientRect().top;
            if (top >= 0 && top <= window.innerHeight) ids.add(id);
          }
        }
      }

      setActiveIds(ids);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:flex flex-col w-44 shrink-0 py-8 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
      <div className="flex items-center gap-2 mb-3">
        <HugeiconsIcon
          icon={Menu01FreeIcons}
          size={13}
          className="text-muted-foreground shrink-0"
        />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Nesta página
        </p>
      </div>

      <nav className="flex flex-col border-l border-border">
        {headings.map(({ id, text, level }, i) => (
          <a
            key={`${id}-${// biome-ignore lint/suspicious/noArrayIndexKey: sem ele ocorre o erro de KEY
i}`}
            href={`#${id}`}
            className={cn(
              "-ml-px border-l-2 py-1 text-sm leading-snug transition-colors",
              level === 2 ? "pl-3 font-medium text-foreground/80" : "pl-6",
              activeIds.has(id)
                ? "border-primary text-primary"
                : level === 2
                  ? "border-transparent hover:text-foreground hover:border-muted-foreground/40"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/40",
            )}
          >
            {text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
