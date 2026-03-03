"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Folder01Icon, Loading02Icon } from "@hugeicons/core-free-icons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldGroupApp } from "@/components/base";
import {
  type CreateCollectionSchema,
  createCollectionSchema,
} from "@/types/collection.schema";
import { Icon } from "@/components/shared/Icon";

interface EditCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
  currentName: string;
  onUpdateCollection: (id: string, name: string) => Promise<unknown>;
  isUpdating: boolean;
}

export function EditCollectionDialog({
  open,
  onOpenChange,
  collectionId,
  currentName,
  onUpdateCollection,
  isUpdating,
}: EditCollectionDialogProps) {
  const form = useForm<CreateCollectionSchema>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: { name: currentName },
  });

  useEffect(() => {
    if (open) {
      form.reset({ name: currentName });
    }
  }, [open, currentName, form]);

  const onSubmit = async (data: CreateCollectionSchema) => {
    try {
      await onUpdateCollection(collectionId, data.name);
      toast.success("Coleção atualizada!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao atualizar coleção. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Editar coleção
          </DialogTitle>
          <DialogDescription>
            Altere o nome da coleção.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FieldGroupApp<CreateCollectionSchema>
            control={form.control}
            align="inline-start"
            firstElement={<Icon icon={Folder01Icon} />}
            name="name"
            label="Nome da coleção"
            placeholder="Ex: Inspirações, Ferramentas..."
            className="rounded-xl"
          />

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              rounded="full"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating} rounded="full">
              {isUpdating ? (
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
