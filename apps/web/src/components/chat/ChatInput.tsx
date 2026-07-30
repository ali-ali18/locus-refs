"use client";

import { Note01Icon } from "@hugeicons/core-free-icons";
import { CheckIcon, ReplyIcon, XIcon } from "lucide-react";
import {
  type ChangeEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useChatPanel } from "@/context/chatPanel";
import {
  useAiModels,
  useAiSettings,
  useUpdateAiSettings,
} from "@/hook/ai/useAiSettings";
import { useNote } from "@/hook/notes/useNotes";
import type { AgentSkillId } from "@/lib/ai/skills";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { InputGroupText } from "../ui/input-group";
import { ChatMentionPicker } from "./ChatMentionPicker";
import type { AgentMention } from "./hook/useAiChat";

interface ChatInputProps {
  onSend: (
    text: string,
    options?: {
      skillId?: AgentSkillId;
      mentions?: AgentMention[];
    },
  ) => void;
  onStop: () => void;
  status: "submitted" | "streaming" | "ready" | "error";
  noteId?: string;
  variant?: "dock" | "hero";
  placeholder?: string;
}

type ModelOption = NonNullable<ReturnType<typeof useAiModels>["data"]>[number];

const NOTE_TITLE_MAX_LENGTH = 20;
const SELECTION_PREVIEW_MAX = 80;

const PROVIDER_LABELS: Record<string, string> = {
  anthropic: "Anthropic",
  minimax: "MiniMax",
};

function providerLabel(provider: string): string {
  return PROVIDER_LABELS[provider] ?? provider;
}

function NoteChip({ noteId }: { noteId: string }) {
  const { data: note } = useNote(noteId);
  if (!note) return null;
  const title =
    note.title.length > NOTE_TITLE_MAX_LENGTH
      ? `${note.title.slice(0, NOTE_TITLE_MAX_LENGTH)}…`
      : note.title;
  return (
    <InputGroupText className="gap-1.5">
      <Icon icon={Note01Icon} className="size-3 shrink-0" />
      <span className="truncate text-xs">{title}</span>
    </InputGroupText>
  );
}

function ModelSelect() {
  const { data: models } = useAiModels();
  const { data: settings } = useAiSettings();
  const { mutate: updateSettings } = useUpdateAiSettings();
  const [open, setOpen] = useState(false);

  const currentModel = models?.find((m) => m.id === settings?.defaultModelId);

  const grouped = useMemo(() => {
    const map = new Map<string, ModelOption[]>();
    for (const model of models ?? []) {
      const list = map.get(model.provider);
      if (list) {
        list.push(model);
      } else {
        map.set(model.provider, [model]);
      }
    }
    return Array.from(map);
  }, [models]);

  const handleSelect = useCallback(
    (id: string) => {
      updateSettings({ defaultModelId: id });
      setOpen(false);
    },
    [updateSettings],
  );

  return (
    <ModelSelector onOpenChange={setOpen} open={open}>
      <ModelSelectorTrigger
        render={<PromptInputButton className="gap-1.5 text-xs" size="sm" />}
      >
        {currentModel ? (
          <ModelSelectorLogo provider={currentModel.provider} />
        ) : null}
        <ModelSelectorName>{currentModel?.label ?? "Modelo"}</ModelSelectorName>
      </ModelSelectorTrigger>
      <ModelSelectorContent title="Selecionar modelo">
        <ModelSelectorInput placeholder="Buscar modelos..." />
        <ModelSelectorList>
          <ModelSelectorEmpty>Nenhum modelo encontrado.</ModelSelectorEmpty>
          {grouped.map(([provider, list]) => (
            <ModelSelectorGroup
              heading={providerLabel(provider)}
              key={provider}
            >
              {list.map((model) => (
                <ModelSelectorItem
                  key={model.id}
                  onSelect={() => handleSelect(model.id)}
                  value={`${providerLabel(model.provider)} ${model.label} ${model.id}`}
                >
                  <ModelSelectorLogo provider={model.provider} />
                  <ModelSelectorName>{model.label}</ModelSelectorName>
                  {settings?.defaultModelId === model.id ? (
                    <CheckIcon className="ml-auto size-4" />
                  ) : (
                    <div className="ml-auto size-4" />
                  )}
                </ModelSelectorItem>
              ))}
            </ModelSelectorGroup>
          ))}
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  );
}

interface MentionQueryState {
  start: number;
  query: string;
}

function detectMentionQuery(value: string, caret: number): MentionQueryState | null {
  const before = value.slice(0, caret);
  const match = before.match(/(^|[\s([{])@([^\s@]*)$/);
  if (!match) return null;
  const atIndex = before.lastIndexOf("@");
  return { start: atIndex, query: match[2] ?? "" };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedDraft({
  text,
  mentions,
}: {
  text: string;
  mentions: AgentMention[];
}) {
  const nodes = useMemo(() => {
    if (!text) return null;

    const titles = [...new Set(mentions.map((m) => m.title).filter(Boolean))].sort(
      (a, b) => b.length - a.length,
    );

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
      className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words px-4 pt-3.5 pb-2 text-sm leading-normal"
    >
      {nodes}
      {text.endsWith("\n") ? <br /> : null}
    </div>
  );
}

export function ChatInput({
  onSend,
  onStop,
  status,
  noteId,
  variant = "dock",
  placeholder = "Pergunte alguma coisa… Digite @ para mencionar",
}: ChatInputProps) {
  const { attachedSelection, clearAttachedSelection } = useChatPanel();
  const isStreaming = status === "submitted" || status === "streaming";
  const [mentions, setMentions] = useState<AgentMention[]>([]);
  const [mentionQuery, setMentionQuery] = useState<MentionQueryState | null>(
    null,
  );
  const [draft, setDraft] = useState("");

  const selectedIds = useMemo(
    () => new Set(mentions.map((m) => m.id)),
    [mentions],
  );

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setDraft(value);
    setMentions((prev) =>
      prev.filter((mention) => value.includes(`@${mention.title}`)),
    );
    const caret = event.target.selectionStart ?? value.length;
    setMentionQuery(detectMentionQuery(value, caret));
  };

  const handleSelectMention = (mention: AgentMention) => {
    if (!mentionQuery) return;

    const before = draft.slice(0, mentionQuery.start);
    const after = draft.slice(
      mentionQuery.start + 1 + mentionQuery.query.length,
    );
    const next = `${before}@${mention.title} ${after}`;
    setDraft(next);
    setMentions((prev) =>
      prev.some((m) => m.id === mention.id) ? prev : [...prev, mention],
    );
    setMentionQuery(null);
  };

  const handleSubmit = (message: PromptInputMessage) => {
    const trimmed = (message.text ?? draft).trim();
    if (!trimmed || isStreaming) return;
    const activeMentions = mentions.filter((mention) =>
      trimmed.includes(`@${mention.title}`),
    );
    onSend(trimmed, {
      mentions: activeMentions.length ? activeMentions : undefined,
    });
    setMentions([]);
    setMentionQuery(null);
    setDraft("");
  };

  return (
    <div className={cn("relative w-full", variant === "dock" && "my-0")}>
      {mentionQuery ? (
        <ChatMentionPicker
          query={mentionQuery.query}
          selectedIds={selectedIds}
          onSelect={handleSelectMention}
        />
      ) : null}

      <PromptInput
        onSubmit={handleSubmit}
        className={cn(
          "rounded-3xl border-border bg-card shadow-sm",
          variant === "hero" && "shadow-md",
        )}
      >
        {attachedSelection ? (
          <PromptInputHeader className="order-first w-full flex-col items-stretch gap-0 border-0 p-0 [.border-b]:pb-0">
            <div className="flex items-center gap-2.5 border-b border-border/50 px-3.5 py-2.5">
              <ReplyIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <p className="min-w-0 flex-1 truncate text-sm text-foreground">
                {attachedSelection.text.length > SELECTION_PREVIEW_MAX
                  ? `${attachedSelection.text.slice(0, SELECTION_PREVIEW_MAX)}…`
                  : attachedSelection.text}
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
        ) : null}

        <div className="relative w-full">
          <HighlightedDraft text={draft} mentions={mentions} />
          <PromptInputTextarea
            className="relative z-10 max-h-32 min-h-14 bg-transparent px-4 pt-3.5 pb-2 text-transparent caret-foreground selection:bg-primary/20"
            placeholder={placeholder}
            onChange={handleTextChange}
            value={draft}
          />
        </div>
        <PromptInputFooter className="px-3 pb-3 pt-1">
          <PromptInputTools>
            {noteId ? <NoteChip noteId={noteId} /> : null}
            <ModelSelect />
          </PromptInputTools>
          <PromptInputSubmit status={status} onStop={onStop} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
