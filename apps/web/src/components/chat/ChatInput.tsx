"use client";

import { useRef } from "react";
import { toast } from "sonner";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import type { AgentSkillId } from "@/lib/ai/skills";
import { cn } from "@/lib/utils";
import { ChatAttachedSelectionHeader } from "./ChatAttachedSelectionHeader";
import {
  ChatAttachMenu,
  ChatPendingAttachments,
} from "./ChatAttachMenu";
import { ChatInputNoteChip } from "./ChatInputNoteChip";
import { ChatMentionDraft } from "./ChatMentionDraft";
import { ChatMentionPicker } from "./ChatMentionPicker";
import { ChatModelSelect } from "./ChatModelSelect";
import { CHAT_ACCEPT } from "./chatInputFiles";
import type { AgentMention, ChatAttachment } from "./hook/useAiChat";
import { useChatInputController } from "./hook/useChatInputController";

export interface ChatInputProps {
  onSend: (
    text: string,
    options?: {
      skillId?: AgentSkillId;
      mentions?: AgentMention[];
      attachments?: ChatAttachment[];
    },
  ) => void;
  onStop: () => void;
  status: "submitted" | "streaming" | "ready" | "error";
  noteId?: string;
  variant?: "dock" | "hero";
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onStop,
  status,
  noteId,
  variant = "dock",
  placeholder = "Pergunte alguma coisa… Digite @ para mencionar",
}: ChatInputProps) {
  const inputAnchorRef = useRef<HTMLDivElement>(null);
  const {
    draft,
    mentions,
    mentionQuery,
    selectedIds,
    isUploading,
    handleTextChange,
    handleSelectMention,
    handleSubmit,
  } = useChatInputController({ onSend, status });

  return (
    <div
      ref={inputAnchorRef}
      className={cn("relative w-full", variant === "dock" && "my-0")}
    >
      {mentionQuery ? (
        <ChatMentionPicker
          query={mentionQuery.query}
          selectedIds={selectedIds}
          onSelect={handleSelectMention}
        />
      ) : null}

      <PromptInput
        accept={CHAT_ACCEPT}
        multiple
        maxFiles={5}
        onError={(err) => toast.error(err.message)}
        onSubmit={handleSubmit}
        className={cn(
          // dark:bg-card sobrescreve dark:bg-input/30 do InputGroup
          "rounded-3xl border-border bg-card shadow-sm dark:bg-card",
          variant === "hero" && "shadow-md",
        )}
      >
        <ChatAttachedSelectionHeader />
        <ChatPendingAttachments />

        <div className="relative w-full">
          <ChatMentionDraft text={draft} mentions={mentions} />
          <PromptInputTextarea
            className="relative z-10 max-h-32 min-h-14 bg-transparent px-4 pt-3.5 pb-2 text-transparent caret-foreground selection:bg-primary/20"
            placeholder={placeholder}
            onChange={handleTextChange}
            value={draft}
          />
        </div>

        <PromptInputFooter className="px-3 pb-3 pt-1">
          <PromptInputTools className="min-w-0 flex-wrap gap-1">
            <ChatAttachMenu
              anchorRef={inputAnchorRef}
              placement={variant === "hero" ? "below" : "above"}
            />
            {noteId ? <ChatInputNoteChip noteId={noteId} /> : null}
            <ChatModelSelect />
          </PromptInputTools>
          <PromptInputSubmit
            status={isUploading ? "submitted" : status}
            onStop={onStop}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
