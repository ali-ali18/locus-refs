"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { File01Icon, Loading02Icon } from "@hugeicons/core-free-icons";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FieldGroupApp } from "@/components/base";
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
import {
  type UpdateHeaderNoteSchema,
  updateHeaderNoteSchema,
} from "@refstash/shared";
import { useNoteMutations } from "@/hook/notes/useNote";
import { IconPicker } from "./IconPicker";

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteId: string;
  currentTitle: string;
  currentIcon?: string;
}

export function EditNoteDialog({
  open,
  onOpenChange,
  noteId,
  currentTitle,
  currentIcon,
}: EditNoteDialogProps) {
  const { updateNote, isLoading } = useNoteMutations();

  const form = useForm<UpdateHeaderNoteSchema>({
    resolver: zodResolver(updateHeaderNoteSchema),
    defaultValues: { title: currentTitle, icon: currentIcon ?? "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ title: currentTitle, icon: currentIcon ?? "" });
    }
  }, [open, currentTitle, currentIcon, form]);

  const onSubmit = async (data: UpdateHeaderNoteSchema) => {
    try {
      await updateNote({
        id: noteId,
        title: data.title,
        icon: data.icon || undefined,
      });
      toast.success("Nota atualizada!");
      onOpenChange(false);
    } catch {
      toast.error("Erro ao atualizar nota. Tente novamente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Editar nota
          </DialogTitle>
          <DialogDescription>
            Altere o título e o ícone da nota.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FieldGroupApp<UpdateHeaderNoteSchema>
            control={form.control}
            align="inline-start"
            firstElement={<Icon icon={File01Icon} />}
            name="title"
            label="Título da nota"
            placeholder="Ex: Ideias para o próximo projeto"
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

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              rounded="full"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} rounded="full">
              {isLoading ? (
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
