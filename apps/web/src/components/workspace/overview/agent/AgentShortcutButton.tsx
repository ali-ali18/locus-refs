"use client";

import { Icon } from "@/components/shared/Icon";
import type { AgentPrompt } from "./agent-prompts";

export function AgentShortcutButton({
  item,
  onRun,
}: {
  item: AgentPrompt;
  onRun: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRun}
      className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon icon={item.icon} className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{item.label}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {item.hint}
        </span>
      </span>
    </button>
  );
}
