"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useWorkspace } from "@/context/workspace";
import { useNoteMutations } from "@/hook/notes/useNote";
import { useNotes } from "@/hook/notes/useNotes";

export function useNavNotes() {
  const { data: notes = [], isLoading } = useNotes();
  const { deleteNote } = useNoteMutations();
  const { workspaceSlug } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();

  const [isAllNotes, setIsAllNotes] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [noteToRename, setNoteToRename] = useState<{
    id: string;
    title: string;
    icon?: string;
  } | null>(null);

  const notesSlice = isAllNotes ? notes : notes.slice(0, 3);

  const handleDelete = async (id: string) => {
    if (pathname === `/${workspaceSlug}/notes/${id}`) {
      router.push(`/${workspaceSlug}`);
    }
    await deleteNote(id);
  };

  return {
    notes,
    notesSlice,
    isLoading,
    isAllNotes,
    setIsAllNotes,
    isCreateOpen,
    setIsCreateOpen,
    noteToRename,
    setNoteToRename,
    handleDelete,
    workspaceSlug,
    pathname,
  };
}
