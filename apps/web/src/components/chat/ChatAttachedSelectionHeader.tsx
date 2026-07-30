"use client";

import { ReplyIcon, XIcon } from "lucide-react";
import { PromptInputHeader } from "@/components/ai-elements/prompt-input";
import { useChatPanel } from "@/context/chatPanel";

const SELECTION_PREVIEW_MAX = 80;

export function ChatAttachedSelectionHeader() {
  const { attachedSelection, clearAttachedSelection } = useChatPanel();
  if (!attachedSelection) return null;

  const preview =
    attachedSelection.text.length > SELECTION_PREVIEW_MAX
      ? `${attachedSelection.text.slice(0, SELECTION_PREVIEW_MAX)}…`
      : attachedSelection.text;

  return (
    <PromptInputHeader className="order-first w-full flex-col items-stretch gap-0 border-0 p-0 [.border-b]:pb-0">
      <div className="flex items-center gap-2.5 border-b border-border/50 px-3.5 py-2.5">
        <ReplyIcon
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <p className="min-w-0 flex-1 truncate text-sm text-foreground">
          {preview}
        </p>
        <button
          type="button"
          aria-label="Remover trecho anexado"
          className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={clearAttachedSelection}
        >
          <XIcon className="size-3.5" />
        </button>
      </div>
    </PromptInputHeader>
  );
}
