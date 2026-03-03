"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCollection,
  deleteCollection,
  getCollections,
  updateCollection,
} from "../services/useCollection";

export function useCollections() {
  const queryClient = useQueryClient();

  const {
    data: collections = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: getCollections,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCollection(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
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
