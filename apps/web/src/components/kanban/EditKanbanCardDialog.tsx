"use client";

import { Loading02Icon } from "@hugeicons/core-free-icons";
import type { KanbanCard } from "@refstash/shared";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KanbanDueDatePicker } from "@/components/kanban/KanbanDueDatePicker";
import { KanbanMemberPicker } from "@/components/kanban/KanbanMemberPicker";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateKanbanCard,
  useDeleteKanbanCard,
  useUpdateKanbanCard,
} from "@/hook/kanban/useKanbanCards";
import {
  formatKanbanDueDateInput,
  type KanbanDueDateRange,
} from "@/lib/kanban/due-date";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
  /** When set, dialog edits this card. When null with columnId, creates a card. */
  card: KanbanCard | null;
  /** Required for create mode (card === null). */
  columnId?: string | null;
}

const emptyDueRange: KanbanDueDateRange = {
  startDate: null,
  dueDate: null,
};

export function EditKanbanCardDialog({
  open,
  onOpenChange,
  boardId,
  card,
  columnId = null,
}: Props) {
  const isCreate = card === null && Boolean(columnId);
  const createCard = useCreateKanbanCard(boardId);
  const updateCard = useUpdateKanbanCard(boardId);
  const deleteCard = useDeleteKanbanCard(boardId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [dueRange, setDueRange] = useState<KanbanDueDateRange>(emptyDueRange);

  useEffect(() => {
    if (!open) return;
    if (card) {
      setTitle(card.title);
      setDescription(card.description ?? "");
      setAssigneeId(card.assigneeId);
      setDueRange({
        startDate: formatKanbanDueDateInput(card.startDate) || null,
        dueDate: formatKanbanDueDateInput(card.dueDate) || null,
      });
      return;
    }
    setTitle("");
    setDescription("");
    setAssigneeId(null);
    setDueRange(emptyDueRange);
  }, [card, open]);

  const isPending =
    createCard.isPending || updateCard.isPending || deleteCard.isPending;

  async function handleSave() {
    const nextTitle = title.trim();
    if (!nextTitle) {
      toast.error("Título é obrigatório");
      return;
    }

    try {
      if (isCreate) {
        if (!columnId) {
          toast.error("Coluna inválida");
          return;
        }
        await createCard.mutateAsync({
          columnId,
          title: nextTitle,
          description: description.trim() || null,
          assigneeId,
          startDate: dueRange.startDate,
          dueDate: dueRange.dueDate,
        });
        toast.success("Card criado");
      } else {
        if (!card) return;
        await updateCard.mutateAsync({
          cardId: card.id,
          title: nextTitle,
          description: description.trim() || null,
          assigneeId,
          startDate: dueRange.startDate,
          dueDate: dueRange.dueDate,
        });
        toast.success("Card atualizado");
      }
      onOpenChange(false);
    } catch {
      toast.error(isCreate ? "Erro ao criar card" : "Erro ao atualizar card");
    }
  }

  async function handleDelete() {
    if (!card) return;
    try {
      await deleteCard.mutateAsync(card.id);
      toast.success("Card removido");
      onOpenChange(false);
    } catch {
      toast.error("Erro ao deletar card");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Novo card" : "Editar card"}</DialogTitle>
          <DialogDescription>
            Título, descrição, prazo e responsável da tarefa
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="kanban-card-title">Título</Label>
            <Input
              id="kanban-card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSave();
                }
              }}
              placeholder="Título do card"
              className="rounded-xl"
              autoFocus={isCreate}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kanban-card-description">Descrição</Label>
            <Textarea
              id="kanban-card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes da tarefa..."
              className="min-h-24 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kanban-card-due-date">Prazo</Label>
            <KanbanDueDatePicker
              value={dueRange}
              onChange={setDueRange}
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Responsável</Label>
            <KanbanMemberPicker
              value={assigneeId}
              onChange={setAssigneeId}
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter
          className={isCreate ? undefined : "sm:justify-between"}
        >
          {!isCreate ? (
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={() => void handleDelete()}
            >
              Deletar
            </Button>
          ) : null}
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-initial"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={isPending}
              className="flex-1 sm:flex-initial"
              onClick={() => void handleSave()}
            >
              {isPending ? (
                <>
                  <Icon
                    icon={Loading02Icon}
                    className="mr-2 size-4 animate-spin"
                  />
                  {isCreate ? "Criando..." : "Salvando..."}
                </>
              ) : isCreate ? (
                "Criar"
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
