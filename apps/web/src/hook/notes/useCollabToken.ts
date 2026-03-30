import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface UseCollabTokenParams {
  noteId: string;
  workspaceId: string;
}

export function useCollabToken({ noteId, workspaceId }: UseCollabTokenParams) {
  return useQuery({
    queryKey: ["collab-token", noteId],
    queryFn: async () => {
      const res = await api.get<{ token: string }>(
        `/api/collab/token?noteId=${noteId}&workspaceId=${workspaceId}`,
      );
      return res.data.token;
    },
    staleTime: 50 * 60 * 1000,
    enabled: !!noteId && !!workspaceId,
  });
}
