"use client";

import { Note01Icon } from "@hugeicons/core-free-icons";
import { useNote } from "@/hook/notes/useNotes";
import { Icon } from "../shared/Icon";

interface ChatNoteContextChipProps {
  noteId: string;
}

export function ChatNoteContextChip({ noteId }: ChatNoteContextChipProps) {
  const { data: note } = useNote(noteId);

  if (!note) return null;

  return (
    <div className="mx-3 mb-2 flex items-center gap-2 rounded-xl border border-sidebar-border bg-sidebar-accent/50 px-3 py-1.5 text-xs text-sidebar-foreground">
      <Icon icon={Note01Icon} className="size-3.5 shrink-0" />
      <span className="truncate">
        Nota anexada: <span className="font-medium">{note.title}</span>
      </span>
    </div>
  );
}
