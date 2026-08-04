"use client";

import type { KanbanBoardDetail, KanbanRealtimeEvent } from "@refstash/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { io, type Socket } from "socket.io-client";
import { useWorkspace } from "@/context/workspace";
import { kanbanKeys } from "@/hook/kanban/kanbanKeys";
import { applyKanbanRealtimeEvent } from "@/lib/realtime/apply-kanban-event";

export type KanbanPresenceMember = {
  userId: string;
  name: string | null;
  image: string | null;
};

type UseKanbanRealtimeOptions = {
  boardId: string;
  /** Ref updated by KanbanBoardView during drag */
  draggingCardIdRef?: MutableRefObject<string | null>;
};

export function useKanbanRealtime({
  boardId,
  draggingCardIdRef,
}: UseKanbanRealtimeOptions) {
  const { workspaceId, workspaceSlug } = useWorkspace();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [presence, setPresence] = useState<KanbanPresenceMember[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_REALTIME_WS_URL;
    if (!wsUrl || !boardId || !workspaceId) return;

    let cancelled = false;
    let socket: Socket | null = null;

    async function connect() {
      try {
        const res = await fetch(
          `/api/realtime/token?workspaceId=${encodeURIComponent(workspaceId)}`,
        );
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { token?: string };
        if (!data.token || cancelled) return;

        socket = io(wsUrl, {
          auth: { token: data.token },
          transports: ["websocket", "polling"],
          autoConnect: true,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
          socket?.emit("board:join", { boardId });
        });

        socket.on("kanban:event", (event: KanbanRealtimeEvent) => {
          if (event.type === "board.deleted") {
            void queryClient.invalidateQueries({
              queryKey: kanbanKeys.all(workspaceId),
            });
            router.push(`/${workspaceSlug}/kanban`);
            return;
          }

          queryClient.setQueryData<KanbanBoardDetail>(
            kanbanKeys.detail(workspaceId, boardId),
            (current) => {
              if (!current) return current;
              const next = applyKanbanRealtimeEvent(current, event, {
                draggingCardId: draggingCardIdRef?.current ?? null,
              });
              return next ?? current;
            },
          );

          if (
            event.type === "card.created" ||
            event.type === "card.updated" ||
            event.type === "card.moved" ||
            event.type === "card.deleted" ||
            event.type === "column.created" ||
            event.type === "column.updated" ||
            event.type === "column.deleted" ||
            event.type === "board.updated"
          ) {
            // Exact: não refetch do detail (já atualizado via setQueryData)
            void queryClient.invalidateQueries({
              queryKey: kanbanKeys.all(workspaceId),
              exact: true,
            });
          }
        });

        socket.on(
          "presence:sync",
          (payload: { boardId: string; members: KanbanPresenceMember[] }) => {
            if (payload.boardId !== boardId) return;
            setPresence(payload.members ?? []);
          },
        );

        socket.on(
          "presence:leave",
          (_payload: { boardId: string; userId: string }) => {
            // sync event follows; no-op
          },
        );
      } catch (err) {
        console.error("[realtime] connect failed", err);
      }
    }

    void connect();

    return () => {
      cancelled = true;
      if (socket) {
        socket.emit("board:leave", { boardId });
        socket.disconnect();
      }
      socketRef.current = null;
      setPresence([]);
    };
  }, [
    boardId,
    workspaceId,
    workspaceSlug,
    queryClient,
    router,
    draggingCardIdRef,
  ]);

  return { presence };
}
