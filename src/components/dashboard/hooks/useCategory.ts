"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../services/useCategory";

export function useCategory() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    createCategory: mutation.mutateAsync,
    isCreatingCategory: mutation.isPending,
  };
}
