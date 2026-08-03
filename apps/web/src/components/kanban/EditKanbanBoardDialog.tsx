"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KanbanIcon, Loading02Icon } from "@hugeicons/core-free-icons";
import {
  type UpdateKanbanBoardSchema,
  updateKanbanBoardSchema,
} from "@refstash/shared";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FieldGroupApp } from "@/components/base";
import { IconPicker } from "@/components/notes/IconPicker";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateKanbanBoard } from "@/hook/kanban/useKanbanBoards";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
  currentTitle: string;
  currentIcon?: string | null;
  currentDescription?: string | null;
}

export function EditKanbanBoardDialog({
  open,
  onOpenChange,
  boardId,
  currentTitle,
  currentIcon,
  currentDescription,
}: Props) {
  const updateBoard = useUpdateKanbanBoard(boardId);

  const form = useForm<UpdateKanbanBoardSchema>({
    resolver: zodResolver(updateKanbanBoardSchema),
    defaultValues: {
      title: currentTitle,
      icon: currentIcon ?? "",
      description: currentDescription ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: currentTitle,
        icon: currentIcon ?? "",
        description: currentDescription ?? "",
      });
    }
  }, [open, currentTitle, currentIcon, currentDescription, form]);

  const onSubmit = async (data: UpdateKanbanBoardSchema) => {
    try {
      await updateBoard.mutateAsync({
        title: data.title,
        icon: data.icon || null,
        description: data.description || null,
      });
      toast.success("Kanban atualizado");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao atualizar kanban");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Icon icon={KanbanIcon} className="text-primary" />
              Editar kanban
            </div>
          </DialogTitle>
          <DialogDescription>Atualize título, ícone ou descrição</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FieldGroupApp<UpdateKanbanBoardSchema>
            control={form.control}
            name="title"
            label="Título"
            className="rounded-xl"
          />
          <Controller
            control={form.control}
            name="icon"
            render={({ field }) => (
              <div className="space-y-1">
                <span className="text-sm font-medium">Ícone</span>
                <IconPicker
                  value={(field.value as string) || null}
                  onChange={(name) => field.onChange(name ?? "")}
                />
              </div>
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <div className="space-y-1">
                <Label htmlFor="edit-kanban-board-description">Descrição</Label>
                <Textarea
                  id="edit-kanban-board-description"
                  value={(field.value as string) ?? ""}
                  onChange={field.onChange}
                  className="rounded-xl"
                />
              </div>
            )}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={updateBoard.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateBoard.isPending}>
              {updateBoard.isPending ? (
                <>
                  <Icon
                    icon={Loading02Icon}
                    className="mr-2 size-4 animate-spin"
                  />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
