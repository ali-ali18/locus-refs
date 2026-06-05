"use client";

import {
  ArrowUp02Icon,
  Cancel01Icon,
  Note01Icon,
  QuoteUpIcon,
  StopIcon,
} from "@hugeicons/core-free-icons";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
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
import { Icon } from "../shared/Icon";
import { InputGroupText } from "../ui/input-group";

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  status: "submitted" | "streaming" | "ready" | "error";
  noteId?: string;
}

const NOTE_TITLE_MAX_LENGTH = 20;
const NOTE_TITLE_PREVIEW_LENGTH = 14;
const NOTE_TITLE_SHORT_CHECK = 10;
const SELECTION_PREVIEW_MAX = 40;

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
      <span className="truncate text-xs">
        {title.slice(0, NOTE_TITLE_PREVIEW_LENGTH)}
        {title.length > NOTE_TITLE_SHORT_CHECK ? "…" : ""}
      </span>
    </InputGroupText>
  );
}

function ModelSelect() {
  const { data: models } = useAiModels();
  const { data: settings } = useAiSettings();
  const { mutate: updateSettings } = useUpdateAiSettings();

  const current = models?.find((m) => m.id === settings?.defaultModelId);

  return (
    <PromptInputSelect
      onValueChange={(value) =>
        updateSettings({ defaultModelId: value as string })
      }
      value={settings?.defaultModelId as string | undefined}
    >
      <PromptInputSelectTrigger className="text-xs">
        <PromptInputSelectValue placeholder={current?.label ?? "Modelo"} />
      </PromptInputSelectTrigger>
      <PromptInputSelectContent className="min-w-40">
        {models?.map((model) => (
          <PromptInputSelectItem
            key={model.id}
            value={model.id}
            className={
              model.id === settings?.defaultModelId ? "font-medium" : ""
            }
          >
            {model.label}
          </PromptInputSelectItem>
        ))}
      </PromptInputSelectContent>
    </PromptInputSelect>
  );
}

export function ChatInput({ onSend, onStop, status, noteId }: ChatInputProps) {
  const { attachedSelection, clearAttachedSelection } = useChatPanel();
  const isStreaming = status === "submitted" || status === "streaming";

  const handleSubmit = (message: { text: string }) => {
    const trimmed = message.text.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
  };

  return (
    <div className="mx-4 my-3 grid grid-cols-1 shadow-md rounded-2xl">
      <PromptInput onSubmit={handleSubmit} className="rounded-2xl">
        <PromptInputHeader className="border-b">
          {attachedSelection ? (
            <InputGroupText className="text-muted-foreground gap-1.5">
              <Icon icon={QuoteUpIcon} className="size-3 shrink-0" />
              <span className="truncate text-xs">
                {attachedSelection.text.length > SELECTION_PREVIEW_MAX
                  ? `${attachedSelection.text.slice(0, SELECTION_PREVIEW_MAX)}…`
                  : attachedSelection.text}
              </span>
            </InputGroupText>
          ) : null}
          {attachedSelection ? (
            <PromptInputButton
              variant="ghost"
              size="icon-sm"
              onClick={clearAttachedSelection}
              aria-label="Remover trecho anexado"
              className="ml-auto"
            >
              <Icon icon={Cancel01Icon} className="size-3" />
            </PromptInputButton>
          ) : null}
        </PromptInputHeader>
        <PromptInputBody>
          <PromptInputTextarea
            placeholder="Digite aqui..."
            disabled={isStreaming}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            {noteId ? <NoteChip noteId={noteId} /> : null}
            <ModelSelect />
          </PromptInputTools>
          <PromptInputSubmit
            status={status}
            onStop={onStop}
            disabled={isStreaming}
          >
            {isStreaming ? (
              <Icon icon={StopIcon} className="size-4" />
            ) : (
              <Icon icon={ArrowUp02Icon} className="size-4" />
            )}
          </PromptInputSubmit>
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
