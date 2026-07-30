"use client";

import type { Note, NotePins } from "@refstash/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/workspace";
import { api } from "@/lib/api";
import { noteKeys } from "./noteKeys";

async function getNotePins(): Promise<NotePins> {
  const { data } = await api.get<NotePins>("/api/notes/pins");
  return data;
}

export function useNotePins() {
  const { workspaceId } = useWorkspace();
  return useQuery({
    queryKey: noteKeys.pins(workspaceId),
    queryFn: getNotePins,
    staleTime: 1000 * 30,
  });
}

export function useNotePinMutations() {
  const queryClient = useQueryClient();
  const { workspaceId } = useWorkspace();

  const invalidatePins = () => {
    void queryClient.invalidateQueries({
      queryKey: noteKeys.pins(workspaceId),
    });
  };

  const openNote = useMutation({
    mutationFn: async (noteId: string) => {
      const { data } = await api.post<{
        data: { lastOpenedAt: string | null; isFavorite: boolean };
      }>(`/api/notes/${noteId}/open`);
      return data.data;
    },
    onSuccess: () => {
      invalidatePins();
    },
  });

  const setFavorite = useMutation({
    mutationFn: async ({
      noteId,
      favorite,
    }: {
      noteId: string;
      favorite: boolean;
    }) => {
      const { data } = await api.put<{
        data: { isFavorite: boolean; favoritedAt: string | null };
      }>(`/api/notes/${noteId}/favorite`, { favorite });
      return { noteId, ...data.data };
    },
    onSuccess: ({ noteId, isFavorite }) => {
      invalidatePins();
      queryClient.setQueryData<Note>(
        noteKeys.detail(workspaceId, noteId),
        (prev) => (prev ? { ...prev, isFavorite } : prev),
      );
    },
    onError: () => {
      toast.error("Não foi possível atualizar o favorito.");
    },
  });

  return {
    recordOpen: openNote.mutate,
    recordOpenAsync: openNote.mutateAsync,
    setFavorite: setFavorite.mutateAsync,
    isUpdatingFavorite: setFavorite.isPending,
  };
}
