"use client";

import type { Note } from "@refstash/shared";
import { CardNotes } from "./CardNotes";

interface NotesListProps {
  notes: Note[];
  workspaceSlug: string;
}

export function NotesList({ notes, workspaceSlug }: NotesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
      {notes.map((note) => (
        <CardNotes
          key={note.id}
          createdAt={note.createdAt}
          icon={note.icon}
          title={note.title}
          updatedAt={note.updatedAt}
          id={note.id}
          workspaceSlug={workspaceSlug}
        />
      ))}
    </div>
  );
}
