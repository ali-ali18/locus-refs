"use client";

import { Loading02Icon } from "@hugeicons/core-free-icons";
import type { KanbanCard } from "@refstash/shared";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
  /** When set, dialog edits this card. When null with columnId, creates a card. */
  card: KanbanCard | null;
  /** Required for create mode (card === null). */
  columnId?: string | null;
}

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

  useEffect(() => {
    if (!open) return;
    if (card) {
      setTitle(card.title);
      setDescription(card.description ?? "");
      setAssigneeId(card.assigneeId);
      return;
    }
    setTitle("");
    setDescription("");
    setAssigneeId(null);
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
        });
        toast.success("Card criado");
      } else {
        if (!card) return;
        await updateCard.mutateAsync({
          cardId: card.id,
          title: nextTitle,
          description: description.trim() || null,
          assigneeId,
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
            Título, descrição e responsável da tarefa
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
            <Label>Responsável</Label>
            <KanbanMemberPicker
              value={assigneeId}
              onChange={setAssigneeId}
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter
          className={
            isCreate ? "gap-2" : "gap-2 sm:justify-between"
          }
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
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={isPending}
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
