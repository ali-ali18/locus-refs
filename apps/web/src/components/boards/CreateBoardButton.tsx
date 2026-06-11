"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loading02Icon, Plus } from "@hugeicons/core-free-icons";
import { type CreateBoardSchema, createBoardSchema } from "@refstash/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { useWorkspace } from "@/context/workspace";
import { useCreateBoard } from "@/hook/boards/useBoards";

export function CreateBoardButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button rounded="xl" onClick={() => setOpen(true)}>
        <Icon icon={Plus} className="size-4" />
        <span>Novo board</span>
      </Button>
      <CreateBoardDialogContent onClose={() => setOpen(false)} />
    </Dialog>
  );
}

function CreateBoardDialogContent({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { workspaceSlug } = useWorkspace();
  const create = useCreateBoard();

  const form = useForm<CreateBoardSchema>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: { title: "", icon: "", description: "" },
  });

  const onSubmit = async (data: CreateBoardSchema) => {
    const board = await create.mutateAsync({
      title: data.title,
      icon: data.icon || undefined,
      description: data.description || undefined,
    });
    form.reset();
    onClose();
    router.push(`/${workspaceSlug}/boards/${board.id}`);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo board</DialogTitle>
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
              <span className="text-sm font-medium text-foreground">Ícone</span>
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
            onClick={onClose}
            disabled={create.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" rounded="full" disabled={create.isPending}>
            {create.isPending ? (
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
  );
}
