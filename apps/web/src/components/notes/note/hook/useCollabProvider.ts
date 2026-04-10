import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import { useCollabToken } from "@/hook/notes/useCollabToken";

interface UseCollabProviderParams {
  noteId: string;
  workspaceId: string;
}

export function useCollabProvider({
  noteId,
  workspaceId,
}: UseCollabProviderParams) {
  const { data: token } = useCollabToken({ noteId, workspaceId });
  const [provider, setProvider] = useState<HocuspocusProvider | undefined>();

  useEffect(() => {
    if (!token) return;

    const p = new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_COLLAB_WS_URL!,
      name: noteId,
      token,
    });

    setProvider(p);

    return () => {
      p.destroy();
      setProvider(undefined);
    };
  }, [token, noteId]);

  return { provider };
}
