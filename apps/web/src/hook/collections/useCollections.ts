"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useWorkspace } from "@/context/workspace";
import {
  createCollection,
  deleteCollection,
  getCollections,
  updateCollection,
} from "../../components/dashboard/services/useCollection";

export function useCollections() {
  const queryClient = useQueryClient();
  const { workspaceId } = useWorkspace();

  const {
    data: collections = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["collections", workspaceId],
    queryFn: getCollections,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", workspaceId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCollection(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", workspaceId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", workspaceId] });
    },
  });

  return {
    collections,
    isLoading,
    isError,
    createCollection: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCollection: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCollection: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
