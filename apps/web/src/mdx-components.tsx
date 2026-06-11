import { isValidElement, type ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { DocsCodeBlock } from "@/components/docs/DocsCodeBlock";
import { DocsPageNavigation } from "@/components/docs/DocsPageNavigation";
import { DocsProjectTree } from "@/components/docs/DocsProjectTree";
import { DocsTable } from "@/components/docs/DocsTable";

function toText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (isValidElement(node)) {
    return toText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  const slugCount = new Map<string, number>();

  function uniqueSlug(children: ReactNode): string {
    const base = slugify(toText(children));
    const count = slugCount.get(base) ?? 0;
    slugCount.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  }

  return {
    h1: ({ children }) => (
      <div className="flex items-center gap-3 mb-4 mt-8 first:mt-0">
        <h1 className="flex-1 text-3xl font-bold text-foreground break-words">
          {children}
        </h1>
        <DocsPageNavigation />
      </div>
    ),
    h2: ({ children }) => {
      const id = uniqueSlug(children);
      return (
        <h2
          id={id}
          className="text-xl font-semibold text-foreground mb-3 mt-8 wrap-break-word scroll-mt-24"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = uniqueSlug(children);
      return (
        <h3
          id={id}
          className="text-base font-semibold text-foreground mb-2 mt-6 wrap-break-word scroll-mt-24"
        >
          {children}
        </h3>
      );
    },
    p: ({ children }) => (
      <p className="text-muted-foreground leading-7 mb-4 wrap-break-word">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary underline underline-offset-4 hover:text-primary/80"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="bg-transparent rounded-xl text-foreground text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => <DocsCodeBlock>{children}</DocsCodeBlock>,
    DocsTable,
    DocsProjectTree,
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 pl-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-muted-foreground space-y-1 mb-4 pl-2">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 text-muted-foreground italic mb-4">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="border-border my-8" />,
    ...components,
  };
}
