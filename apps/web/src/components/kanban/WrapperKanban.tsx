"use client";

import { useRef } from "react";
import { KanbanBoardTabs } from "@/components/kanban/KanbanBoardTabs";
import { KanbanBoardView } from "@/components/kanban/KanbanBoardView";
import { Skeleton } from "@/components/ui/skeleton";
import { useKanbanBoard } from "@/hook/kanban/useKanbanBoards";
import { useKanbanRealtime } from "@/hook/kanban/useKanbanRealtime";

interface Props {
  boardId: string;
}

export function WrapperKanban({ boardId }: Props) {
  const { data: board, isLoading, isError } = useKanbanBoard(boardId);
  const draggingCardIdRef = useRef<string | null>(null);
  const { presence } = useKanbanRealtime({ boardId, draggingCardIdRef });

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col overflow-hidden">
      <KanbanBoardTabs activeBoardId={boardId} />

      <div className="min-h-0 flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex gap-4 p-5">
            {["a", "b", "c"].map((k) => (
              <Skeleton
                key={k}
                className="h-40 w-[300px] shrink-0 rounded-2xl"
              />
            ))}
          </div>
        ) : isError || !board ? (
          <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
            Não foi possível carregar este kanban.
          </div>
        ) : (
          <KanbanBoardView
            board={board}
            draggingCardIdRef={draggingCardIdRef}
            presence={presence}
          />
        )}
      </div>
    </div>
  );
}
