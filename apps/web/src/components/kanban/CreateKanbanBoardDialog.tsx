"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KanbanIcon, Loading02Icon } from "@hugeicons/core-free-icons";
import {
  type CreateKanbanBoardSchema,
  createKanbanBoardSchema,
} from "@refstash/shared";
import { useRouter } from "next/navigation";
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
import { useWorkspace } from "@/context/workspace";
import { useCreateKanbanBoard } from "@/hook/kanban/useKanbanBoards";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectOnCreate?: boolean;
}

export function CreateKanbanBoardDialog({
  open,
  onOpenChange,
  redirectOnCreate = true,
}: Props) {
  const router = useRouter();
  const { workspaceSlug } = useWorkspace();
  const createBoard = useCreateKanbanBoard();

  const form = useForm<CreateKanbanBoardSchema>({
    resolver: zodResolver(createKanbanBoardSchema),
    defaultValues: { title: "", icon: "", description: "" },
  });

  const onSubmit = async (data: CreateKanbanBoardSchema) => {
    try {
      const board = await createBoard.mutateAsync({
        title: data.title,
        icon: data.icon || undefined,
        description: data.description || undefined,
      });
      toast.success("Kanban criado");
      form.reset();
      onOpenChange(false);
      if (redirectOnCreate) {
        router.push(`/${workspaceSlug}/kanban/${board.id}`);
      }
    } catch (error) {
      toast.error("Erro ao criar kanban");
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
              Novo kanban
            </div>
          </DialogTitle>
          <DialogDescription>
            Quadro de tarefas com colunas para o workspace
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FieldGroupApp<CreateKanbanBoardSchema>
            control={form.control}
            name="title"
            label="Título"
            placeholder="Ex: Sprint, Bugs, Onboarding..."
            className="rounded-xl"
          />

          <Controller
            control={form.control}
            name="icon"
            render={({ field }) => (
              <div className="space-y-1">
                <span className="text-sm font-medium text-foreground">
                  Ícone
                </span>
                <IconPicker
                  value={field.value || null}
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
                <Label htmlFor="kanban-board-description">Descrição</Label>
                <Textarea
                  {...field}
                  id="kanban-board-description"
                  value={field.value ?? ""}
                  placeholder="Opcional"
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
              disabled={createBoard.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createBoard.isPending}>
              {createBoard.isPending ? (
                <>
                  <Icon
                    icon={Loading02Icon}
                    className="mr-2 size-4 animate-spin"
                  />
                  Criando...
                </>
              ) : (
                "Criar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
