"use client";

import {
  ArrowUp02Icon,
  Cancel01Icon,
  ChevronDown,
  Note01Icon,
  QuoteUpIcon,
  StopIcon,
} from "@hugeicons/core-free-icons";
import { type KeyboardEvent, useRef, useState } from "react";
import { useChatPanel } from "@/context/chatPanel";
import {
  useAiModels,
  useAiSettings,
  useUpdateAiSettings,
} from "@/hook/ai/useAiSettings";
import { useNote } from "@/hook/notes/useNotes";
import { Icon } from "../shared/Icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  noteId?: string;
}

function NoteChip({ noteId }: { noteId: string }) {
  const { data: note } = useNote(noteId);
  if (!note) return null;
  const title =
    note.title.length > 20 ? `${note.title.slice(0, 20)}…` : note.title;
  return (
    <InputGroupText className="gap-1.5">
      <Icon icon={Note01Icon} className="size-3 shrink-0" />
      <span className="truncate text-xs">
        {title.slice(0, 14)}
        {title.length > 10 ? "…" : ""}
      </span>
    </InputGroupText>
  );
}

function ModelDropdown() {
  const { data: models } = useAiModels();
  const { data: settings } = useAiSettings();
  const { mutate: updateSettings } = useUpdateAiSettings();

  const current = models?.find((m) => m.id === settings?.defaultModelId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="ml-auto rounded-xl"
        render={
          <InputGroupButton
            variant="ghost"
            className="pr-1.5! text-xs"
            suppressHydrationWarning
          >
            {current?.label ?? "Modelo"}
            <Icon icon={ChevronDown} className="size-3" />
          </InputGroupButton>
        }
      />
      <DropdownMenuContent align="center" className={"min-w-40"}>
        <DropdownMenuGroup>
          {models?.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => updateSettings({ defaultModelId: model.id })}
              className={`${model.id === settings?.defaultModelId ? "font-medium" : ""}`}
            >
              {model.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ChatInput({
  onSend,
  onStop,
  isStreaming,
  noteId,
}: ChatInputProps) {
  const { attachedSelection, clearAttachedSelection } = useChatPanel();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mx-4 my-3 grid grid-cols-1 shadow-md rounded-2xl">
      <InputGroup className="rounded-2xl z-20">
        {attachedSelection && (
          <InputGroupAddon align="block-start" className="border-b">
            <InputGroupText className="text-muted-foreground gap-1.5">
              <Icon icon={QuoteUpIcon} className="size-3 shrink-0" />
              <span className="truncate text-xs">
                {attachedSelection.text.length > 40
                  ? `${attachedSelection.text.slice(0, 40)}…`
                  : attachedSelection.text}
              </span>
            </InputGroupText>
            <button
              type="button"
              onClick={clearAttachedSelection}
              className="ml-auto rounded-full p-0.5 text-sidebar-foreground/60 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground "
              aria-label="Remover trecho anexado"
            >
              <Icon icon={Cancel01Icon} className="size-3" />
            </button>
          </InputGroupAddon>
        )}
        <InputGroupTextarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite aqui..."
          className="min-h-[100px]"
          disabled={isStreaming}
        />
        <InputGroupAddon align="block-end">
          {noteId && <NoteChip noteId={noteId} />}
          <ModelDropdown />
          <InputGroupButton
            variant="default"
            size="icon-sm"
            onClick={isStreaming ? onStop : handleSend}
            disabled={!isStreaming && !value.trim()}
          >
            <Icon icon={isStreaming ? StopIcon : ArrowUp02Icon} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
