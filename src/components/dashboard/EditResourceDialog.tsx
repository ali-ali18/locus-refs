"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loading02Icon } from "@hugeicons/core-free-icons";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { Collection } from "@/types/collection.type";
import {
  type CreateResourceStep2Schema,
  createResourceStep2Schema,
} from "@/types/resource.schema";
import type { UpdateResourceBody } from "@/types/resources";
import type { Category } from "./services/useCategory";
import type { ResourceFromApi } from "./services/useResource";

interface EditResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: ResourceFromApi | null;
  collections: Collection[];
  categories: Category[];
  onUpdateResource: (id: string, body: UpdateResourceBody) => Promise<unknown>;
  isUpdating: boolean;
}

const EMPTY_VALUES: CreateResourceStep2Schema = {
  title: "",
  description: "",
  url: "",
  collectionId: "",
  categoryIds: [],
};

export function EditResourceDialog({
  open,
  onOpenChange,
  resource,
  collections,
  categories,
  onUpdateResource,
  isUpdating,
}: EditResourceDialogProps): React.ReactElement {
  const form = useForm<CreateResourceStep2Schema>({
    resolver: zodResolver(createResourceStep2Schema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open && resource) {
      form.reset({
        title: resource.title ?? "",
        description: resource.description ?? "",
        url: resource.url ?? "",
        collectionId: resource.collectionId ?? "",
        categoryIds: resource.categories.map((category) => category.id),
      });
      return;
    }

    if (!open) {
      form.reset(EMPTY_VALUES);
    }
  }, [open, resource, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!resource) return;

    try {
      await onUpdateResource(resource.id, {
        title: data.title,
        description: data.description || null,
        url: data.url,
        collectionId: data.collectionId,
        categoryIds: data.categoryIds,
      });
      toast.success("Recurso atualizado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao atualizar recurso. Tente novamente.");
      console.error(error);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Editar Recurso
          </DialogTitle>
          <DialogDescription>
            Atualize os dados do recurso selecionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FieldGroupApp<CreateResourceStep2Schema>
            control={form.control}
            name="title"
            label="Título"
            placeholder="Título do recurso"
            className="rounded-xl"
          />

          <FieldGroupApp<CreateResourceStep2Schema>
            control={form.control}
            name="description"
            label="Descrição (opcional)"
            placeholder="Descrição"
            className="rounded-xl"
          />

          <FieldGroupApp<CreateResourceStep2Schema>
            control={form.control}
            name="url"
            label="URL"
            placeholder="https://"
            className="rounded-xl"
          />

          <Field data-slot="field-set" className="flex flex-col gap-2">
            <FieldLabel>Coleção</FieldLabel>
            <Controller
              name="collectionId"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={field.disabled}
                >
                  <SelectTrigger className="w-full rounded-xl">
                    <span className="flex flex-1 truncate text-left">
                      {field.value
                        ? (collections.find((c) => c.id === field.value)?.name ??
                          "Selecione uma coleção")
                        : "Selecione uma coleção"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{form.formState.errors.collectionId?.message}</FieldError>
          </Field>

          <Field data-slot="field-set" className="flex flex-col gap-2">
            <FieldLabel>Categorias</FieldLabel>
            <Controller
              name="categoryIds"
              control={form.control}
              render={({ field }) => {
                const selectedCategoryId = field.value[0] ?? "";
                return (
                  <Select
                    value={selectedCategoryId || "__none__"}
                    onValueChange={(value) => {
                      if (value === "__none__") {
                        field.onChange([]);
                        return;
                      }
                      field.onChange([value]);
                    }}
                    disabled={field.disabled}
                  >
                    <SelectTrigger className="w-full rounded-xl">
                      <span className="flex flex-1 truncate text-left">
                        {selectedCategoryId
                          ? (categories.find((c) => c.id === selectedCategoryId)
                              ?.name ?? "Selecione uma categoria")
                          : "Selecione uma categoria"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">
                        Selecione uma categoria
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />
            <FieldError>{form.formState.errors.categoryIds?.message}</FieldError>
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              rounded="full"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" rounded="full" disabled={isUpdating || !resource}>
              {isUpdating ? (
                <>
                  <Icon icon={Loading02Icon} className="mr-2 size-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

