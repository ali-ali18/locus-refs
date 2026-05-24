"use client";

import { ArrowUp02Icon, ChevronDown, Note01Icon, StopIcon } from "@hugeicons/core-free-icons";
import { type KeyboardEvent, useRef, useState } from "react";
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
  const title = note.title.length > 20 ? `${note.title.slice(0, 20)}…` : note.title;
  return (
    <InputGroupText className="gap-1.5">
      <Icon icon={Note01Icon} className="size-3 shrink-0" />
      <span className="truncate text-xs">{title}</span>
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
        className="ml-auto"
        render={
          <InputGroupButton variant="ghost" className="pr-1.5! text-xs" suppressHydrationWarning>
            {current?.label ?? "Modelo"}{" "}
            <Icon icon={ChevronDown} className="size-3" />
          </InputGroupButton>
        }
      />
      <DropdownMenuContent align="center" className={'min-w-40'}>
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

export function ChatInput({ onSend, onStop, isStreaming, noteId }: ChatInputProps) {
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
    <div className="mx-4 my-3 grid grid-cols-1 gap-2">
      <InputGroup className="rounded-2xl">
        <InputGroupTextarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite aqui..."
          className="min-h-[90px]"
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
