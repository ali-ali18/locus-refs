import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/workspace";
import { api } from "@/lib/api";
import type { Note } from "@refstash/shared";
import { noteKeys } from "./noteKeys";

interface CreateNotePayload {
  title: string;
  icon?: string;
  collectionId?: string;
}

interface UpdateNotePayload {
  id: string;
  title?: string;
  icon?: string;
  content?: string;
  collectionId?: string;
}

export function useNoteMutations() {
  const queryClient = useQueryClient();
  const { workspaceId } = useWorkspace();

  const createMutation = useMutation({
    mutationFn: async (payload: CreateNotePayload) => {
      const { data } = await api.post<{ note: Note }>("/api/notes", payload);
      return data.note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all(workspaceId) });
    },
    onError: () => {
      toast.error("Erro ao criar nota. Tente novamente.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }: UpdateNotePayload) => {
      const { data } = await api.patch<{ note: Note }>(
        `/api/notes/${id}`,
        payload,
      );
      return data.note;
    },
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all(workspaceId) });
      queryClient.invalidateQueries({ queryKey: noteKeys.detail(workspaceId, note.id) });
    },
    onError: () => {
      toast.error("Erro ao atualizar nota. Tente novamente.");
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/notes/${id}`);
      return id;
    },
    onSuccess: (_deletedId) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all(workspaceId) });
      queryClient.invalidateQueries({ queryKey: noteKeys.detail(workspaceId, _deletedId) });
    },
    onError: () => {
      toast.error("Erro ao excluir nota. Tente novamente.");
    },
  });

  return {
    createNote: createMutation.mutateAsync,
    updateNote: updateMutation.mutateAsync,
    deleteNote: deleteNote.mutateAsync,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteNote.isPending,
  };
}
