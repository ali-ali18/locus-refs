"use client";

import { Note02FreeIcons } from "@hugeicons/core-free-icons";
import { useNotes } from "@/hook/notes/useNotes";
import { EmptyApp } from "../base/EmptyApp";
import { Skeleton } from "../ui/skeleton";
import { NotesList } from "./NotesList";

export function ContentNotes() {
  const { data, isLoading } = useNotes();

  if (data && data.length === 0 && !isLoading) {
    return (
      <EmptyApp
        className="rounded-xl border"
        title="Você ainda não tem nenhuma nota"
        description="Crie uma nova nota para começar a anotar"
        icon={Note02FreeIcons}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64 rounded-xl" aria-hidden />
        ))}
      </div>
    );
  }

  return <NotesList notes={data ?? []} />;
}
