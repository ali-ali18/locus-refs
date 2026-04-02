"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Folder01Icon, Loading02Icon } from "@hugeicons/core-free-icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FieldGroupApp } from "@/components/base";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  type CreateCollectionSchema,
  createCollectionSchema,
} from "@refstash/shared";
import { useCollections } from "@/hook/collections/useCollections";

interface Props {
  onSuccess?: () => void;
}

export function FormCreateCollection({ onSuccess }: Props) {
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
      onSuccess?.();
    } catch (_error) {
      toast.error("Erro ao criar coleção. Tente novamente.");
    }
  };

  return (
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
        <DialogClose
          render={
            <Button variant="outline" rounded="full" disabled={isCreating}>
              Cancelar
            </Button>
          }
        >
          Cancelar
        </DialogClose>
        <Button type="submit" rounded="full" disabled={isCreating}>
          {isCreating ? (
            <>
              <Icon icon={Loading02Icon} className="mr-2 size-4 animate-spin" />
              <span aria-hidden>Criando...</span>
              <span className="sr-only">Criando coleção...</span>
            </>
          ) : (
            "Criar coleção"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
