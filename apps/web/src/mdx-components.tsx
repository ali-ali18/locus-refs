import type { MDXComponents } from "mdx/types";
import { DocsCodeBlock } from "@/components/docs/DocsCodeBlock";
import { DocsPageNavigation } from "@/components/docs/DocsPageNavigation";
import { DocsProjectTree } from "@/components/docs/DocsProjectTree";
import { DocsTable } from "@/components/docs/DocsTable";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <div className="flex items-center gap-3 mb-4 mt-8 first:mt-0">
        <h1 className="flex-1 text-3xl font-bold text-foreground break-words">
          {children}
        </h1>
        <DocsPageNavigation />
      </div>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold text-foreground mb-3 mt-8 wrap-break-word">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-semibold text-foreground mb-2 mt-6 wrap-break-word">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-muted-foreground leading-7 mb-4 wrap-break-word">{children}</p>
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
