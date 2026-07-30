"use client";

import { Note01Icon } from "@hugeicons/core-free-icons";
import { useNote } from "@/hook/notes/useNotes";
import { Icon } from "../shared/Icon";
import { InputGroupText } from "../ui/input-group";

const NOTE_TITLE_MAX_LENGTH = 20;

export function ChatInputNoteChip({ noteId }: { noteId: string }) {
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
