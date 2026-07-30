"use client";

import { useMemo } from "react";
import type { AgentMention } from "./hook/useAiChat";

export interface MentionQueryState {
  start: number;
  query: string;
}

export function detectMentionQuery(
  value: string,
  caret: number,
): MentionQueryState | null {
  const before = value.slice(0, caret);
  const match = before.match(/(^|[\s([{])@([^\s@]*)$/);
  if (!match) return null;
  const atIndex = before.lastIndexOf("@");
  return { start: atIndex, query: match[2] ?? "" };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function ChatMentionDraft({
  text,
  mentions,
}: {
  text: string;
  mentions: AgentMention[];
}) {
  const nodes = useMemo(() => {
    if (!text) return null;

    const titles = [
      ...new Set(mentions.map((m) => m.title).filter(Boolean)),
    ].sort((a, b) => b.length - a.length);

    if (titles.length === 0) {
      return <span className="text-foreground">{text}</span>;
    }

    const pattern = new RegExp(
      `(@(?:${titles.map(escapeRegExp).join("|")}))`,
      "g",
    );
    const parts = text.split(pattern);

    return parts.map((part, index) => {
      const isMention = titles.some((title) => part === `@${title}`);
      return (
        <span
          key={`${index}-${part.slice(0, 12)}`}
          className={isMention ? "font-medium text-primary" : "text-foreground"}
        >
          {part}
        </span>
      );
    });
  }, [mentions, text]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap wrap-break-word px-4 pt-3.5 pb-2 text-sm leading-normal"
    >
      {nodes}
      {text.endsWith("\n") ? <br /> : null}
    </div>
  );
}
