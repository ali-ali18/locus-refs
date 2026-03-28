"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Folder01Icon, Loading02Icon } from "@hugeicons/core-free-icons";
import { useForm } from "react-hook-form";
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
  type CreateCollectionSchema,
  createCollectionSchema,
} from "@/types/schema/collection.schema";
import { useCollections } from "../../hook/collections/useCollections";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCollectionDialog({ open, onOpenChange }: Props) {
  const { createCollection, isCreating } = useCollections();

  const form = useForm<CreateCollectionSchema>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateCollectionSchema) => {
    try {
      await createCollection(data.name);
      toast.success("Coleção criada com sucesso!");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao criar coleção. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Nova Coleção
          </DialogTitle>
          <DialogDescription>
            Crie uma nova coleção para organizar seus recursos.
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
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating} rounded="full">
              {isCreating ? (
                <>
                  <Icon
                    icon={Loading02Icon}
                    className="mr-2 animate-spin size-4"
                  />
                  <span className="sr-only">Criando coleção...</span>
                </>
              ) : (
                "Criar Coleção"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
