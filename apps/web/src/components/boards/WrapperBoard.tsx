"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

const BoardCanvas = dynamic(
  () => import("@/components/boards/BoardCanvas").then((m) => m.BoardCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="bg-muted/30 flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="text-muted-foreground size-8" />
          <p className="text-muted-foreground text-sm">Carregando canvas...</p>
        </div>
      </div>
    ),
  },
);

interface Props {
  boardId: string;
  workspaceId: string;
}

export function WrapperBoard({ boardId, workspaceId }: Props) {
  return (
    <div className="h-[calc(100vh-4rem)] pt-0.5 pl-0.5">
      <BoardCanvas boardId={boardId} workspaceId={workspaceId} />
    </div>
  );
}
