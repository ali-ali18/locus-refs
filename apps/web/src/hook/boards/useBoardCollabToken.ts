"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface UseBoardCollabTokenParams {
  boardId: string | undefined;
  workspaceId: string | undefined;
}

/**
 * Hook que busca o JWT assinado pelo apps/web pro tldraw-sync worker.
 *
 * Token expira em 1h (server-side), cacheamos por 50min no client pra
 * evitar refetch desnecessário.
 */
export function useBoardCollabToken({
  boardId,
  workspaceId,
}: UseBoardCollabTokenParams) {
  return useQuery({
    queryKey: ["board-collab-token", workspaceId, boardId],
    queryFn: async () => {
      if (!boardId || !workspaceId) {
        throw new Error("Missing boardId or workspaceId");
      }
      const { data } = await api.get<{ token: string }>(
        `/api/collab/board-token?boardId=${boardId}&workspaceId=${workspaceId}`,
      );
      return data.token;
    },
    enabled: !!boardId && !!workspaceId,
    staleTime: 50 * 60 * 1000,
    retry: 1,
  });
}
