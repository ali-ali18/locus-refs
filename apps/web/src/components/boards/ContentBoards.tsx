"use client";

import {
  ArrowUpRight01Icon,
  Clock01Icon,
  DashboardSquare01Icon,
  MoreHorizontalCircle01Icon,
  PencilEdit01Icon,
  Trash2,
} from "@hugeicons/core-free-icons";
import type { Board } from "@refstash/shared";
import Link from "next/link";
import { useState } from "react";
import { EmptyApp } from "@/components/base/EmptyApp";
import { CreateBoardButton } from "@/components/boards/CreateBoardButton";
import { DeleteBoardDialog } from "@/components/boards/DeleteBoardDialog";
import { EditBoardDialog } from "@/components/boards/EditBoardDialog";
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
import { useBoards, useDeleteBoard } from "@/hook/boards/useBoards";
import { resolveIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function ContentBoards() {
  const { workspaceSlug } = useWorkspace();
  const { data: boards, isLoading } = useBoards();
  const [boardToEdit, setBoardToEdit] = useState<Board | null>(null);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);
  const deleteBoard = useDeleteBoard();

  const hasBoards = !isLoading && boards && boards.length > 0;

  return (
    <>
      {hasBoards && (
        <Item variant="muted">
          <ItemMedia
            variant="icon"
            className="bg-primary/10 text-primary rounded p-1.5"
          >
            <Icon icon={DashboardSquare01Icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-lg font-semibold">Meus Boards</ItemTitle>
            <ItemDescription>
              Quadros visuais para planejar, mapear e colaborar com o seu time
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <CreateBoardButton />
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
          icon={DashboardSquare01Icon}
          title="Nenhum board ainda"
          description='Clique em "Novo board" para criar seu primeiro canvas colaborativo.'
          action={<CreateBoardButton />}
          className="min-h-[calc(100dvh-52px)]"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              href={`/${workspaceSlug}/boards/${board.id}`}
              onEdit={() => setBoardToEdit(board)}
              onDelete={() => setBoardToDelete(board)}
            />
          ))}
        </div>
      )}

      <EditBoardDialog
        open={boardToEdit !== null}
        onOpenChange={(open) => !open && setBoardToEdit(null)}
        boardId={boardToEdit?.id ?? ""}
        currentTitle={boardToEdit?.title ?? ""}
        currentIcon={boardToEdit?.icon}
        currentDescription={boardToEdit?.description}
      />

      <DeleteBoardDialog
        open={boardToDelete !== null}
        onOpenChange={(o) => !o && setBoardToDelete(null)}
        boardId={boardToDelete?.id ?? ""}
        boardTitle={boardToDelete?.title ?? ""}
        onConfirm={async (id) => {
          await deleteBoard.mutateAsync(id);
          setBoardToDelete(null);
        }}
      />
    </>
  );
}

function BoardCard({
  board,
  href,
  onEdit,
  onDelete,
}: {
  board: Board;
  href: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const ResolvedIcon = board.icon
    ? resolveIcon(board.icon)
    : DashboardSquare01Icon;
  const createdAt = new Date(board.createdAt).toLocaleDateString("pt-BR");

  return (
    <Card className="group relative flex flex-col rounded-xl p-0 overflow-hidden transition-shadow duration-200 hover:shadow-sm">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "absolute top-3 right-3 z-10 p-1.5 rounded-xl",
            "text-muted-foreground hover:text-foreground hover:bg-accent",
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
          <ItemMedia variant="icon" className="bg-muted rounded-xl p-2 size-9">
            <Icon
              icon={ResolvedIcon}
              className="size-5 text-muted-foreground"
            />
          </ItemMedia>
          <ItemContent className="min-w-0">
            <ItemTitle>{board.title}</ItemTitle>
            {board.description && (
              <ItemDescription>{board.description}</ItemDescription>
            )}
          </ItemContent>
        </Item>
      </Link>

      <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-border">
        <span className="text-muted-foreground hidden items-center gap-1.5 text-xs sm:flex">
          <Icon icon={Clock01Icon} className="size-3.5 shrink-0" />
          Criado em {createdAt}
        </span>

        <div className="flex items-center gap-2 sm:hidden">
          <Button variant="secondary" size="sm" onClick={onEdit}>
            <Icon icon={PencilEdit01Icon} className="size-4" />
            Editar
          </Button>
          <Button size="sm" nativeButton={false} render={<Link href={href} />}>
            Abrir
            <Icon icon={ArrowUpRight01Icon} className="size-4" />
          </Button>
        </div>

        {/* Desktop: single open button */}
        <Button
          className="ml-auto hidden sm:inline-flex"
          nativeButton={false}
          render={<Link href={href} />}
          size="default"
        >
          <Icon icon={ArrowUpRight01Icon} className="size-4" />
          Abrir
        </Button>
      </div>
    </Card>
  );
}
