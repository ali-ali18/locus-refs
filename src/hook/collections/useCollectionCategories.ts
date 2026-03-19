import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Category } from "@/types/categories.type";

export function useCollectionCategories(collectionId: string | null) {
  return useQuery<Category[]>({
    queryKey: ["collection-categories", collectionId],
    queryFn: async () => {
      const { data } = await api.get<Category[]>(
        `/api/collection/${collectionId}/categories`,
      );
      return data;
    },
    enabled: collectionId != null && collectionId !== "",
    staleTime: 1000 * 60 * 5,
  });
}
