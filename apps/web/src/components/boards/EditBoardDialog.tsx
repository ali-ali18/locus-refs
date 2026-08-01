"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loading02Icon } from "@hugeicons/core-free-icons";
import { type UpdateBoardSchema, updateBoardSchema } from "@refstash/shared";
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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateBoard } from "@/hook/boards/useBoards";

interface EditBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
  currentTitle: string;
  currentIcon?: string | null;
  currentDescription?: string | null;
}

export function EditBoardDialog({
  open,
  onOpenChange,
  boardId,
  currentTitle,
  currentIcon,
  currentDescription,
}: EditBoardDialogProps) {
  const updateBoard = useUpdateBoard(boardId);

  const form = useForm<UpdateBoardSchema>({
    resolver: zodResolver(updateBoardSchema),
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

  const onSubmit = async (data: UpdateBoardSchema) => {
    try {
      await updateBoard.mutateAsync({
        title: data.title,
        icon: data.icon || null,
        description: data.description || null,
      });
      toast.success("Board atualizado!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao atualizar board. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Editar board
          </DialogTitle>
          <DialogDescription>
            Altere o título, ícone e descrição do board.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FieldGroupApp<UpdateBoardSchema>
            control={form.control}
            name="title"
            label="Título do board"
            placeholder="Ex: Brainstorm Q3, Roadmap..."
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
                <span className="text-sm font-medium text-foreground">
                  Descrição
                </span>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Ex: Canvas para brainstorming do Q3..."
                  className="rounded-xl"
                />
              </div>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={updateBoard.isPending}
              className="rounded-full"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateBoard.isPending}
              className="rounded-full"
            >
              {updateBoard.isPending ? (
                <>
                  <Icon
                    icon={Loading02Icon}
                    className="mr-2 animate-spin size-4"
                  />
                  <span className="sr-only">Salvando...</span>
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
