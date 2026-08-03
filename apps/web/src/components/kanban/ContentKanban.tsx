"use client";

import {
  ArrowUpRight01Icon,
  Clock01Icon,
  KanbanIcon,
  MoreHorizontalCircle01Icon,
  PencilEdit01Icon,
  Trash2,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useState } from "react";
import { EmptyApp } from "@/components/base/EmptyApp";
import { CreateKanbanBoardButton } from "@/components/kanban/CreateKanbanBoardButton";
import { DeleteKanbanBoardDialog } from "@/components/kanban/DeleteKanbanBoardDialog";
import { EditKanbanBoardDialog } from "@/components/kanban/EditKanbanBoardDialog";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/context/workspace";
import {
  type KanbanBoardListItem,
  useDeleteKanbanBoard,
  useKanbanBoards,
} from "@/hook/kanban/useKanbanBoards";
import { resolveIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function ContentKanban() {
  const { workspaceSlug } = useWorkspace();
  const { data: boards, isLoading } = useKanbanBoards();
  const deleteBoard = useDeleteKanbanBoard();
  const [boardToEdit, setBoardToEdit] = useState<KanbanBoardListItem | null>(
    null,
  );
  const [boardToDelete, setBoardToDelete] =
    useState<KanbanBoardListItem | null>(null);

  const hasBoards = !isLoading && boards && boards.length > 0;

  return (
    <>
      {hasBoards && (
        <Item variant="muted">
          <ItemMedia
            variant="icon"
            className="bg-primary/10 text-primary rounded-xl p-1.5"
          >
            <Icon icon={KanbanIcon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-lg font-semibold">Kanban</ItemTitle>
            <ItemDescription>
              Quadros de tarefas com colunas para organizar o trabalho do time
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <CreateKanbanBoardButton />
          </ItemActions>
        </Item>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["a", "b", "c"].map((k) => (
            <Skeleton key={k} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : !boards || boards.length === 0 ? (
        <EmptyApp
          icon={KanbanIcon}
          title="Nenhum kanban ainda"
          description='Clique em "Novo kanban" para criar seu primeiro quadro de tarefas.'
          action={<CreateKanbanBoardButton />}
          className="min-h-[calc(100dvh-52px)]"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
          {boards.map((board) => (
            <KanbanListCard
              key={board.id}
              board={board}
              href={`/${workspaceSlug}/kanban/${board.id}`}
              onEdit={() => setBoardToEdit(board)}
              onDelete={() => setBoardToDelete(board)}
            />
          ))}
        </div>
      )}

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
        onOpenChange={(o) => !o && setBoardToDelete(null)}
        boardId={boardToDelete?.id ?? ""}
        boardTitle={boardToDelete?.title ?? ""}
        isPending={deleteBoard.isPending}
        onConfirm={async (id) => {
          await deleteBoard.mutateAsync(id);
          setBoardToDelete(null);
        }}
      />
    </>
  );
}

function KanbanListCard({
  board,
  href,
  onEdit,
  onDelete,
}: {
  board: KanbanBoardListItem;
  href: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const ResolvedIcon = board.icon ? resolveIcon(board.icon) : KanbanIcon;
  const createdAt = new Date(board.createdAt).toLocaleDateString("pt-BR");

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-xl p-0 transition-shadow duration-200 hover:shadow-sm">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "absolute top-3 right-3 z-10 rounded-xl p-1.5",
            "text-muted-foreground hover:bg-accent hover:text-foreground",
            "hidden sm:block",
            "opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 focus-visible:opacity-100",
            "transition-opacity",
          )}
        >
          <Icon icon={MoreHorizontalCircle01Icon} className="size-4" />
          <span className="sr-only">Mais opções</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 rounded-xl">
          <DropdownMenuItem onClick={onEdit}>
            <Icon icon={PencilEdit01Icon} className="size-4" />
            Renomear
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={onDelete}
          >
            <Icon icon={Trash2} className="size-4" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link href={href} className="flex-1 p-4 sm:pr-10">
        <Item className="border-0 p-0">
          <ItemMedia variant="icon" className="bg-muted size-9 rounded-xl p-2">
            <Icon
              icon={ResolvedIcon}
              className="size-5 text-muted-foreground"
            />
          </ItemMedia>
          <ItemContent className="min-w-0">
            <ItemTitle>{board.title}</ItemTitle>
            {board.description ? (
              <ItemDescription>{board.description}</ItemDescription>
            ) : (
              <ItemDescription>
                {board._count.cards} card(s) · {board._count.columns} colunas
              </ItemDescription>
            )}
          </ItemContent>
        </Item>
      </Link>

      <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-3">
        <span className="text-muted-foreground hidden items-center gap-1.5 text-xs sm:flex">
          <Icon icon={Clock01Icon} className="size-3.5 shrink-0" />
          Criado em {createdAt}
        </span>
        <Button
          className="ml-auto"
          nativeButton={false}
          render={<Link href={href} />}
        >
          <Icon icon={ArrowUpRight01Icon} className="size-4" />
          Abrir
        </Button>
      </div>
    </Card>
  );
}
