"use client";

import { useQuery } from "@tanstack/react-query";
import { getResources } from "../services/useResource";

export function useResources(collectionId: string | null) {
  return useQuery({
    queryKey: ["resources", collectionId],
    queryFn: () => getResources(collectionId),
    enabled: collectionId != null && collectionId !== "",
    staleTime: 1000 * 60 * 5,
  });
}
