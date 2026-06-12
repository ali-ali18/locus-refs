"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateCollectionSchema,
  UpdateCollectionSchema,
} from "@refstash/shared";
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
    mutationFn: (payload: CreateCollectionSchema) => createCollection(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", workspaceId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & UpdateCollectionSchema) =>
      updateCollection(id, payload),
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
