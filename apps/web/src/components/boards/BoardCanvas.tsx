"use client";

import { useSync } from "@tldraw/sync";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type Editor,
  type TLAssetStore,
  type TLComponents,
  Tldraw,
} from "tldraw";
import { Spinner } from "@/components/ui/spinner";
import { useBoardCollabToken } from "@/hook/boards/useBoardCollabToken";
import { useSession } from "@/lib/auth-client";

import "tldraw/tldraw.css";

interface Props {
  boardId: string;
  workspaceId: string;
}

export function BoardCanvas({ boardId, workspaceId }: Props) {
  const { data: session } = useSession();
  const { data: token } = useBoardCollabToken({ boardId, workspaceId });
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!editor) return;
    editor.user.updateUserPreferences({
      colorScheme: resolvedTheme === "dark" ? "dark" : "light",
    });
  }, [editor, resolvedTheme]);

  const syncBaseUrl = useMemo(() => {
    const fromEnv = process.env.NEXT_PUBLIC_TLDRAW_SYNC_WS_URL;
    return fromEnv ? fromEnv.replace(/\/$/, "") : null;
  }, []);

  // Lê o token via ref no momento do upload, mantendo `assets` com referência
  // estável (senão o useEffect do useSync rerodaria e reconectaria o socket).
  const tokenRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const assets = useMemo<TLAssetStore>(
    () => ({
      // Sobe a mídia pro worker (R2). PUT autenticado com o JWT do board;
      // a URL retornada é pública e estável (carregada por <img>).
      upload: async (_asset, file) => {
        if (!syncBaseUrl) {
          throw new Error("NEXT_PUBLIC_TLDRAW_SYNC_WS_URL não configurado");
        }
        // syncBaseUrl é ws://|wss:// (pro WebSocket). fetch() não aceita esse
        // esquema, então converte pra http://|https:// pro upload do asset.
        const httpBase = syncBaseUrl.replace(/^ws(s)?:\/\//, "http$1://");
        const objectId = `${boardId}/${crypto.randomUUID()}`;
        const url = `${httpBase}/api/uploads/${objectId}`;
        const res = await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            ...(tokenRef.current
              ? { Authorization: `Bearer ${tokenRef.current}` }
              : {}),
          },
        });
        if (!res.ok) {
          throw new Error(`Falha no upload do asset (HTTP ${res.status})`);
        }
        return { src: url };
      },
      resolve: (asset) => asset.props.src,
    }),
    [syncBaseUrl, boardId],
  );

  const uri = useMemo(() => {
    if (!syncBaseUrl || !token) return null;
    return `${syncBaseUrl}/api/boards/${boardId}/connect?token=${encodeURIComponent(token)}`;
  }, [syncBaseUrl, token, boardId]);

  if (!isMounted) {
    return <CenterMessage title="Carregando canvas..." />;
  }

  if (!syncBaseUrl) {
    return (
      <CenterMessage
        title="Sync não configurado"
        subtitle="Defina NEXT_PUBLIC_TLDRAW_SYNC_WS_URL para conectar ao worker."
      />
    );
  }

  if (!token || !uri) {
    return <CenterMessage title="Autenticando..." spinner />;
  }

  return (
    <BoardCanvasSession
      assets={assets}
      onEditorChange={setEditor}
      uri={uri}
      user={session?.user}
    />
  );
}

function BoardCanvasSession({
  assets,
  onEditorChange,
  uri,
  user,
}: {
  assets: TLAssetStore;
  onEditorChange: (editorInstance: Editor) => void;
  uri: string;
  user: { id: string; name: string } | undefined;
}) {
  const store = useSync({
    uri,
    assets,
  });

  if (store.status === "loading") {
    return <CenterMessage title="Conectando ao board..." spinner />;
  }

  if (store.status === "error") {
    return (
      <CenterMessage title="Erro de conexão" subtitle={store.error.message} />
    );
  }

  return (
    <div className="tldraw-wrapper relative h-full w-full isolate">
      <Tldraw
        store={store.store}
        components={defaultComponents}
        onMount={(editorInstance) => {
          onEditorChange(editorInstance);
          if (user) {
            editorInstance.user.updateUserPreferences({
              name: user.name,
              color: hashToColor(user.id),
            });
          }
        }}
      />
    </div>
  );
}

const defaultComponents: TLComponents = {};

function CenterMessage({
  title,
  subtitle,
  spinner,
}: {
  title: string;
  subtitle?: string;
  spinner?: boolean;
}) {
  return (
    <div className="bg-muted/30 flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        {spinner && <Spinner className="text-muted-foreground size-8" />}
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground max-w-sm text-sm">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function hashToColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 55%)`;
}
