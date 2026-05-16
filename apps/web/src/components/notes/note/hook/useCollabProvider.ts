import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useRef, useState } from "react";

interface UseCollabProviderParams {
  noteId: string;
  workspaceId: string;
}

export function useCollabProvider({
  noteId,
  workspaceId,
}: UseCollabProviderParams) {
  const [provider, setProvider] = useState<HocuspocusProvider | undefined>();
  const workspaceIdRef = useRef(workspaceId);
  workspaceIdRef.current = workspaceId;

  useEffect(() => {
    const p = new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_COLLAB_WS_URL!,
      name: noteId,
      token: async () => {
        const res = await fetch(
          `/api/collab/token?noteId=${noteId}&workspaceId=${workspaceIdRef.current}`,
        );
        if (!res.ok) throw new Error("Failed to fetch collab token");
        const data = await res.json();
        return data.token;
      },
    });

    setProvider(p);

    return () => {
      p.destroy();
      setProvider(undefined);
    };
  }, [noteId]);

  return { provider };
}
