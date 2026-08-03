"use client";

import { ArrowRight01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type {
  KanbanBoardDetail,
  KanbanCard,
  KanbanUserSummary,
} from "@refstash/shared";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { EditKanbanCardDialog } from "@/components/kanban/EditKanbanCardDialog";
import { KanbanColumnMenu } from "@/components/kanban/KanbanColumnMenu";
import {
  KanbanBoard,
  KanbanCard as KanbanCardUi,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/kibo-ui/kanban";
import { Icon } from "@/components/shared/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateKanbanColumn } from "@/hook/kanban/useKanbanColumns";
import { useMoveKanbanCard } from "@/hook/kanban/useKanbanCards";
import { cn } from "@/lib/utils";

type CardDialogState =
  | { mode: "create"; columnId: string }
  | { mode: "edit"; cardId: string };

type DnDItem = {
  id: string;
  name: string;
  column: string;
  description: string | null;
  assigneeId: string | null;
  createdBy?: KanbanCard["createdBy"];
  assignee?: KanbanCard["assignee"];
};

function toItems(board: KanbanBoardDetail): DnDItem[] {
  return [...board.cards]
    .sort((a, b) => a.position - b.position)
    .map((card) => ({
      id: card.id,
      name: card.title,
      column: card.columnId,
      description: card.description,
      assigneeId: card.assigneeId,
      createdBy: card.createdBy,
      assignee: card.assignee,
    }));
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function CardPersonAvatar({
  person,
  className,
}: {
  person: KanbanUserSummary;
  className?: string;
}) {
  return (
    <Avatar
      className={cn(
        "size-6 shrink-0 overflow-hidden ring-1 ring-border",
        className,
      )}
      title={person.name}
    >
      <AvatarImage alt={person.name} src={person.image ?? undefined} />
      <AvatarFallback className="text-[10px]">
        {initials(person.name)}
      </AvatarFallback>
    </Avatar>
  );
}

function CardAssigneeFlow({
  requester,
  assignee,
}: {
  requester?: KanbanUserSummary;
  assignee?: KanbanUserSummary | null;
}) {
  if (!requester && !assignee) return null;

  return (
    <div className="flex items-center gap-1">
      {requester ? <CardPersonAvatar person={requester} /> : null}
      {requester && assignee ? (
        <Icon
          icon={ArrowRight01Icon}
          className="size-3.5 shrink-0 text-muted-foreground"
        />
      ) : null}
      {assignee ? <CardPersonAvatar person={assignee} /> : null}
    </div>
  );
}

interface Props {
  board: KanbanBoardDetail;
}

export function KanbanBoardView({ board }: Props) {
  const createColumn = useCreateKanbanColumn(board.id);
  const moveCard = useMoveKanbanCard(board.id);

  const [items, setItems] = useState<DnDItem[]>(() => toItems(board));
  const itemsRef = useRef(items);
  const draggingIdRef = useRef<string | null>(null);
  const [cardDialog, setCardDialog] = useState<CardDialogState | null>(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  useEffect(() => {
    if (draggingIdRef.current) return;
    const next = toItems(board);
    setItems(next);
    itemsRef.current = next;
  }, [board]);

  const columns = [...board.columns]
    .sort((a, b) => a.position - b.position)
    .map((c) => ({ id: c.id, name: c.name, color: c.color }));

  const editingCard =
    cardDialog?.mode === "edit"
      ? (board.cards.find((card) => card.id === cardDialog.cardId) ?? null)
      : null;

  function persistMove(cardId: string) {
    const data = itemsRef.current;
    const card = data.find((c) => c.id === cardId);
    if (!card) return;

    const inColumn = data.filter((c) => c.column === card.column);
    const index = inColumn.findIndex((c) => c.id === cardId);
    if (index < 0) return;

    const beforeCardId = index > 0 ? inColumn[index - 1].id : null;
    const afterCardId =
      index < inColumn.length - 1 ? inColumn[index + 1].id : null;

    const serverOrder = board.cards
      .filter((c) => c.columnId === card.column)
      .sort((a, b) => a.position - b.position)
      .map((c) => c.id)
      .join();
    const localOrder = inColumn.map((c) => c.id).join();
    const serverCard = board.cards.find((c) => c.id === cardId);

    if (
      serverCard &&
      serverCard.columnId === card.column &&
      localOrder === serverOrder
    ) {
      return;
    }

    moveCard.mutate(
      {
        cardId,
        columnId: card.column,
        beforeCardId,
        afterCardId,
      },
      {
        onError: () => {
          toast.error("Não foi possível mover o card");
          const reset = toItems(board);
          setItems(reset);
          itemsRef.current = reset;
        },
      },
    );
  }

  async function handleCreateColumn() {
    const name = newColumnName.trim();
    if (!name) return;
    try {
      await createColumn.mutateAsync({ name });
      setNewColumnName("");
      setIsAddingColumn(false);
      toast.success("Coluna criada");
    } catch {
      toast.error("Erro ao criar coluna");
    }
  }

  return (
    <>
      <div className="h-full min-h-0 overflow-x-auto p-5 pt-4">
      <KanbanProvider
        className="flex h-full min-h-0 w-max items-start gap-4 overflow-visible"
        columns={columns}
        data={items}
        onDataChange={(next) => {
          setItems(next);
          itemsRef.current = next;
        }}
        onDragStart={(event) => {
          draggingIdRef.current = String(event.active.id);
        }}
        onDragEnd={() => {
          const id = draggingIdRef.current;
          draggingIdRef.current = null;
          if (id) {
            queueMicrotask(() => persistMove(id));
          }
        }}
        trailing={
          <div className="w-[260px] shrink-0 pt-0.5">
            {isAddingColumn ? (
              <div className="flex flex-col gap-2 rounded-2xl bg-muted/70 p-3">
                <Input
                  autoFocus
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleCreateColumn();
                    }
                    if (e.key === "Escape") {
                      setIsAddingColumn(false);
                      setNewColumnName("");
                    }
                  }}
                  placeholder="Nome da coluna"
                  className="h-8 rounded-xl bg-background"
                />
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    disabled={createColumn.isPending}
                    onClick={() => void handleCreateColumn()}
                  >
                    Adicionar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsAddingColumn(false);
                      setNewColumnName("");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="h-10 w-full justify-start rounded-2xl text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                onClick={() => setIsAddingColumn(true)}
              >
                <Icon icon={PlusSignIcon} className="size-4" />
                Nova coluna
              </Button>
            )}
          </div>
        }
      >
        {(column) => {
          const columnData = board.columns.find((c) => c.id === column.id);
          const meta = columns.find((c) => c.id === column.id);
          const count = items.filter((i) => i.column === column.id).length;

          return (
            <div className="flex w-[300px] shrink-0 flex-col" key={column.id}>
              <KanbanBoard id={column.id} className="h-auto min-h-0 w-full">
                <KanbanHeader className="px-3.5 pt-3.5 pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="flex min-w-0 flex-1 items-center gap-2 px-1">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor: meta?.color ?? "#94a3b8",
                        }}
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                        {column.name}
                      </span>
                      <span className="shrink-0 text-sm font-medium text-muted-foreground tabular-nums">
                        {count}
                      </span>
                    </div>
                    {columnData ? (
                      <KanbanColumnMenu
                        boardId={board.id}
                        column={columnData}
                        cardCount={count}
                        canDelete={board.columns.length > 1}
                      />
                    ) : null}
                  </div>
                </KanbanHeader>

                <KanbanCards
                  className="max-h-[min(60vh,32rem)] min-h-0"
                  id={column.id}
                >
                  {(item: DnDItem) => {
                    return (
                      <KanbanCardUi
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        column={item.column}
                        className="group/card-item"
                      >
                        <button
                          type="button"
                          className="flex w-full flex-col gap-2 text-left"
                          onClick={() =>
                            setCardDialog({ mode: "edit", cardId: item.id })
                          }
                        >
                          <div className="flex items-start gap-2">
                            <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-foreground">
                              {item.name}
                            </p>
                            <CardAssigneeFlow
                              requester={item.createdBy}
                              assignee={item.assignee}
                            />
                          </div>

                          {item.description ? (
                            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground/70">
                              Sem descrição
                            </p>
                          )}
                        </button>
                      </KanbanCardUi>
                    );
                  }}
                </KanbanCards>

                <div className="px-2.5 pb-2.5 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-full justify-start text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      setCardDialog({ mode: "create", columnId: column.id })
                    }
                  >
                    <Icon icon={PlusSignIcon} className="size-4" />
                    Novo card
                  </Button>
                </div>
              </KanbanBoard>
            </div>
          );
        }}
      </KanbanProvider>
      </div>

      <EditKanbanCardDialog
        open={cardDialog !== null}
        onOpenChange={(open) => !open && setCardDialog(null)}
        boardId={board.id}
        card={editingCard}
        columnId={
          cardDialog?.mode === "create" ? cardDialog.columnId : null
        }
      />
    </>
  );
}
