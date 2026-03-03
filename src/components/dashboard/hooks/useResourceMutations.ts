"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateResourceBody } from "@/types/resources";
import {
  type CreateResourcePayload,
  createResource,
  deleteResource,
  updateResource,
} from "../services/useResource";

export function useResourceMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateResourcePayload) => createResource(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; body: UpdateResourceBody }) =>
      updateResource(params.id, params.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });

  return {
    createResource: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteResource: deleteMutation.mutateAsync,
    isDeletingResource: deleteMutation.isPending,
    updateResource: updateMutation.mutateAsync,
    isUpdatingResource: updateMutation.isPending,
  };
}
