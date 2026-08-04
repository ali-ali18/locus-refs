"use client";

import {
  KanbanIcon,
  MoreHorizontalCircle01Icon,
  PencilEdit01Icon,
  PlusSignIcon,
  Trash2,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CreateKanbanBoardDialog } from "@/components/kanban/CreateKanbanBoardDialog";
import { DeleteKanbanBoardDialog } from "@/components/kanban/DeleteKanbanBoardDialog";
import { EditKanbanBoardDialog } from "@/components/kanban/EditKanbanBoardDialog";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/context/workspace";
import {
  type KanbanBoardListItem,
  useDeleteKanbanBoard,
  useKanbanBoards,
} from "@/hook/kanban/useKanbanBoards";
import { resolveIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface Props {
  activeBoardId: string;
}

export function KanbanBoardTabs({ activeBoardId }: Props) {
  const router = useRouter();
  const { workspaceSlug } = useWorkspace();
  const { data: boards, isLoading } = useKanbanBoards();
  const deleteBoard = useDeleteKanbanBoard();

  const [createOpen, setCreateOpen] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState<KanbanBoardListItem | null>(
    null,
  );
  const [boardToDelete, setBoardToDelete] =
    useState<KanbanBoardListItem | null>(null);

  async function handleDelete(id: string) {
    const remaining = (boards ?? []).filter((board) => board.id !== id);
    try {
      await deleteBoard.mutateAsync(id);
      toast.success("Kanban removido");
      setBoardToDelete(null);
      if (id === activeBoardId) {
        const next = remaining[0];
        router.push(
          next
            ? `/${workspaceSlug}/kanban/${next.id}`
            : `/${workspaceSlug}/kanban`,
        );
      }
    } catch {
      toast.error("Erro ao deletar kanban");
    }
  }

  return (
    <>
      <div className="flex min-w-0 items-center gap-2 border-b border-border bg-background px-3 py-2">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex items-center gap-1.5 pb-1">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-28 rounded-xl" />
                <Skeleton className="h-8 w-24 rounded-xl" />
              </>
            ) : (
              boards?.map((board) => {
                const active = board.id === activeBoardId;
                const BoardIcon = board.icon
                  ? resolveIcon(board.icon)
                  : KanbanIcon;
                return (
                  <div
                    key={board.id}
                    className={cn(
                      "group/tab inline-flex h-8 max-w-56 items-center rounded-xl",
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <Link
                      href={`/${workspaceSlug}/kanban/${board.id}`}
                      className="inline-flex min-w-0 items-center gap-2 py-1.5 pl-3 pr-1 text-sm"
                    >
                      <Icon icon={BoardIcon} className="size-3.5 shrink-0" />
                      <span className="truncate">{board.title}</span>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            className={cn(
                              "mr-1 shrink-0 text-muted-foreground hover:text-foreground",
                              active
                                ? "opacity-100"
                                : "opacity-0 group-hover/tab:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100",
                            )}
                            aria-label={`Opções de ${board.title}`}
                          >
                            <Icon
                              icon={MoreHorizontalCircle01Icon}
                              className="size-3.5"
                            />
                          </Button>
                        }
                      />
                      <DropdownMenuContent
                        align="start"
                        className="w-44 rounded-xl"
                      >
                        <DropdownMenuItem
                          className="rounded-xl"
                          onClick={() => setBoardToEdit(board)}
                        >
                          <Icon icon={PencilEdit01Icon} className="size-4" />
                          Renomear
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          className="rounded-xl"
                          onClick={() => setBoardToDelete(board)}
                        >
                          <Icon icon={Trash2} className="size-4" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })
            )}
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Novo kanban"
              className="shrink-0"
              onClick={() => setCreateOpen(true)}
            >
              <Icon icon={PlusSignIcon} className="size-4" />
            </Button>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <CreateKanbanBoardDialog open={createOpen} onOpenChange={setCreateOpen} />

      <EditKanbanBoardDialog
        open={boardToEdit !== null}
        onOpenChange={(open) => !open && setBoardToEdit(null)}
        boardId={boardToEdit?.id ?? ""}
        currentTitle={boardToEdit?.title ?? ""}
        currentIcon={boardToEdit?.icon}
        currentDescription={boardToEdit?.description}
      />

      <DeleteKanbanBoardDialog
        open={boardToDelete !== null}
        onOpenChange={(open) => !open && setBoardToDelete(null)}
        boardId={boardToDelete?.id ?? ""}
        boardTitle={boardToDelete?.title ?? ""}
        isPending={deleteBoard.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
