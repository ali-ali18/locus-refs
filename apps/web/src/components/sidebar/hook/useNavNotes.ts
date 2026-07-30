"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useWorkspace } from "@/context/workspace";
import { useCollections } from "@/hook/collections/useCollections";
import { useNoteMutations } from "@/hook/notes/useNote";
import { useNotePinMutations, useNotePins } from "@/hook/notes/useNotePins";
import { useNotes } from "@/hook/notes/useNotes";

export function useNavNotes() {
  const { data: notes = [], isLoading: isLoadingNotes } = useNotes();
  const {
    collections,
    isLoading: isLoadingCollections,
    deleteCollection,
  } = useCollections();
  const { deleteNote, updateNote } = useNoteMutations();
  const { data: pins } = useNotePins();
  const { setFavorite } = useNotePinMutations();
  const { workspaceSlug } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();

  const [isAllNotes, setIsAllNotes] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [noteToRename, setNoteToRename] = useState<{
    id: string;
    title: string;
    icon?: string;
  } | null>(null);
  const [collectionToEdit, setCollectionToEdit] = useState<{
    id: string;
    name: string;
    description?: string;
    color?: string;
  } | null>(null);
  const [openCollections, setOpenCollections] = useState<Set<string>>(
    new Set(),
  );

  const favoriteIds = useMemo(
    () => new Set((pins?.favorites ?? []).map((item) => item.id)),
    [pins?.favorites],
  );

  const toggleCollection = (id: string) => {
    setOpenCollections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const collectionsWithNotes = collections
    .filter((c) => c.isNoteCollection)
    .map((c) => ({
      ...c,
      notes: notes.filter((n) => n.collectionId === c.id),
    }));

  const ungroupedNotes = notes.filter((n) => n.collectionId === null);
  const ungroupedSlice = isAllNotes
    ? ungroupedNotes
    : ungroupedNotes.slice(0, 3);

  const isLoading = isLoadingNotes || isLoadingCollections;

  const handleDeleteNote = async (id: string) => {
    if (pathname === `/${workspaceSlug}/notes/${id}`) {
      router.push(`/${workspaceSlug}`);
    }
    await deleteNote(id);
  };

  const handleDeleteCollection = async (id: string) => {
    await deleteCollection(id);
  };

  const handleToggleFavorite = async (id: string) => {
    await setFavorite({ noteId: id, favorite: !favoriteIds.has(id) });
  };

  return {
    notes,
    collectionsWithNotes,
    ungroupedNotes,
    ungroupedSlice,
    isLoading,
    isAllNotes,
    setIsAllNotes,
    isCreateOpen,
    setIsCreateOpen,
    isCreateCollectionOpen,
    setIsCreateCollectionOpen,
    noteToRename,
    setNoteToRename,
    collectionToEdit,
    setCollectionToEdit,
    openCollections,
    toggleCollection,
    handleDeleteNote,
    handleDeleteCollection,
    handleToggleFavorite,
    favoriteIds,
    updateNote,
    workspaceSlug,
    pathname,
  };
}
