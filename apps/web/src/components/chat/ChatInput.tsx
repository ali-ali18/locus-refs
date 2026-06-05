"use client";

import {
  Cancel01Icon,
  Note01Icon,
  QuoteUpIcon,
} from "@hugeicons/core-free-icons";
import { CheckIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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
  PromptInputBody,
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
import { Icon } from "../shared/Icon";
import { InputGroupText } from "../ui/input-group";

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  status: "submitted" | "streaming" | "ready" | "error";
  noteId?: string;
}

type ModelOption = NonNullable<ReturnType<typeof useAiModels>["data"]>[number];

const NOTE_TITLE_MAX_LENGTH = 20;
const SELECTION_PREVIEW_MAX = 40;

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

export function ChatInput({ onSend, onStop, status, noteId }: ChatInputProps) {
  const { attachedSelection, clearAttachedSelection } = useChatPanel();
  const isStreaming = status === "submitted" || status === "streaming";

  const handleSubmit = (message: PromptInputMessage) => {
    const trimmed = message.text?.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
  };

  return (
    <div className="mx-4 my-3">
      <PromptInput onSubmit={handleSubmit} className="rounded-[2rem] shadow-md">
        {attachedSelection ? (
          <PromptInputHeader className="border-b px-3.5 py-1">
            <InputGroupText className="gap-1.5 py-0 text-muted-foreground">
              <Icon icon={QuoteUpIcon} className="size-3 shrink-0" />
              <span className="truncate text-xs">
                {attachedSelection.text.length > SELECTION_PREVIEW_MAX
                  ? `${attachedSelection.text.slice(0, SELECTION_PREVIEW_MAX)}…`
                  : attachedSelection.text}
              </span>
            </InputGroupText>
            <PromptInputButton
              aria-label="Remover trecho anexado"
              className="ml-auto"
              onClick={clearAttachedSelection}
              size="icon-xs"
              variant="ghost"
            >
              <Icon icon={Cancel01Icon} className="size-3" />
            </PromptInputButton>
          </PromptInputHeader>
        ) : null}
        <PromptInputBody>
          <PromptInputTextarea
            className="max-h-32"
            placeholder="Digite aqui..."
          />
        </PromptInputBody>
        <PromptInputFooter>
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
