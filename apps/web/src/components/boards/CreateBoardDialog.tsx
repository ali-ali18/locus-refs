"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LayoutGridIcon, Loading02Icon } from "@hugeicons/core-free-icons";
import { type CreateBoardSchema, createBoardSchema } from "@refstash/shared";
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
import { useCreateBoard } from "@/hook/boards/useBoards";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBoardDialog({ open, onOpenChange }: Props) {
  const createBoard = useCreateBoard();

  const form = useForm<CreateBoardSchema>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: { title: "", icon: "", description: "" },
  });

  const onSubmit = async (data: CreateBoardSchema) => {
    try {
      await createBoard.mutateAsync({
        title: data.title,
        icon: data.icon || undefined,
        description: data.description || undefined,
      });
      toast.success("Board criado com sucesso!");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao criar board. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Icon icon={LayoutGridIcon} className="text-primary" />
              Novo board
            </div>
          </DialogTitle>
          <DialogDescription>
            Crie um canvas colaborativo pro workspace
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FieldGroupApp<CreateBoardSchema>
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
              variant="ghost"
              rounded="full"
              onClick={() => onOpenChange(false)}
              disabled={createBoard.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              rounded="full"
              disabled={createBoard.isPending}
            >
              {createBoard.isPending ? (
                <>
                  <Icon
                    icon={Loading02Icon}
                    className="mr-2 size-4 animate-spin"
                  />
                  <span className="sr-only">Criando board...</span>
                  <span aria-hidden>Criando...</span>
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
