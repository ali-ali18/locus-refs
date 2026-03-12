"use client";

import {
  NodeViewContent,
  type NodeViewProps,
  NodeViewWrapper,
} from "@tiptap/react";
import { Geist_Mono } from "next/font/google";
import { CopyContent } from "./CopyContent";
import { SelectLanguage } from "./SelectLanguage";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SUPPORTED_LANGUAGES = [
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Bash", value: "bash" },
  { label: "CSS", value: "css" },
  { label: "HTML", value: "html" },
  { label: "Markdown", value: "markdown" },
  { label: "YAML", value: "yaml" },
  { label: "XML", value: "xml" },
  { label: "SQL", value: "sql" },
  { label: "PHP", value: "php" },
  { label: "Ruby", value: "ruby" },
  { label: "Java", value: "java" },
  { label: "C#", value: "csharp" },
  { label: "C++", value: "cpp" },
  { label: "C", value: "c" },
];

export function CodeBlockView({ node, updateAttributes }: NodeViewProps) {
  const handleLanguageChange = (language: string) => {
    updateAttributes({ language });
  };

  return (
    <NodeViewWrapper className="relative rounded-xl border border-border bg-muted">
      <div
        contentEditable={false}
        className="flex items-center gap-2 border-b p-2.5 py-3 justify-between"
      >
        <SelectLanguage
          options={SUPPORTED_LANGUAGES}
          value={node.attrs.language}
          onChange={handleLanguageChange}
        />
        <CopyContent content={node.attrs.title} />
      </div>

      <pre
        className={`p-4 overflow-x-auto bg-transparent font-mono text-sm ${geistMono.className} language-${node.attrs.language}`}
      >
        <NodeViewContent as={"code"} />
      </pre>
    </NodeViewWrapper>
  );
}
