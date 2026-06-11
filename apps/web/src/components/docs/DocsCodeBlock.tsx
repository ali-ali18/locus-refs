import React from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CodeBlockContent } from "@/components/kibo-ui/code-block/server";
import type { BundledLanguage } from "shiki";

function getTextContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (React.isValidElement(node)) {
    return getTextContent((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function getCodeInfo(children: ReactNode): {
  text: string;
  language: BundledLanguage;
} {
  if (!React.isValidElement(children))
    return { text: String(children ?? ""), language: "typescript" };
  const props = children.props as { className?: string; children?: ReactNode };
  const raw = (props.className ?? "").replace("language-", "");
  const language = (raw || "typescript") as BundledLanguage;
  return { text: getTextContent(props.children), language };
}

const blockStyles = cn(
  "text-sm",
  "[&_pre]:py-4",
  "[&_.shiki]:!bg-transparent",
  "[&_code]:w-full",
  "[&_code]:grid",
  "[&_code]:overflow-x-auto",
  "[&_code]:bg-transparent",
  "[&_.line]:px-4",
  "[&_.line]:w-full",
  "[&_.line]:relative",
  "dark:[&_.shiki_span]:![color:var(--shiki-dark)]",
);

export async function DocsCodeBlock({ children }: { children: ReactNode }) {
  const { text, language } = getCodeInfo(children);

  return (
    <div className="border border-border rounded-xl my-4 overflow-hidden">
      <div className={blockStyles}>
        <CodeBlockContent language={language}>{text}</CodeBlockContent>
      </div>
    </div>
  );
}
