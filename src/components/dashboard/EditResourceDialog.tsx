"use client";

import { Loading02Icon } from "@hugeicons/core-free-icons";
import type { ReactElement } from "react";
import { Controller } from "react-hook-form";
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
import type { CreateResourceStep2Schema } from "@/types/schema/resource.schema";
import { useCategories } from "../../hook/categories/useCategories";
import { useCollections } from "./hooks/useCollections";
import { useEditResourceDialog } from "./hooks/useEditResourceDialog";
import type { ResourceFromApi } from "./services/useResource";

interface EditResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: ResourceFromApi | null;
}

export function EditResourceDialog({
  open,
  onOpenChange,
  resource,
}: EditResourceDialogProps): ReactElement {
  const { collections } = useCollections();
  const { data: categories = [] } = useCategories();

  const { form, handleSubmit, isUpdatingResource } = useEditResourceDialog({
    open,
    resource,
    onOpenChange,
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
                        ? (collections.find((c) => c.id === field.value)
                            ?.name ?? "Selecione uma coleção")
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
            <FieldError>
              {form.formState.errors.collectionId?.message}
            </FieldError>
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
            <FieldError>
              {form.formState.errors.categoryIds?.message}
            </FieldError>
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
            <Button
              type="submit"
              rounded="full"
              disabled={isUpdatingResource || !resource}
            >
              {isUpdatingResource ? (
                <>
                  <Icon
                    icon={Loading02Icon}
                    className="mr-2 size-4 animate-spin"
                  />
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
