"use client";

import { Loading02Icon } from "@hugeicons/core-free-icons";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { FieldGroupApp } from "@/components/base";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { Collection } from "@/types/collection.type";
import type { CreateResourceStep2Schema } from "@/types/schema/resource.schema";
import type { Category } from "../services/useCategory";

interface ResourceDialogStepDetailsFormProps {
  control: Control<CreateResourceStep2Schema>;
  formState: {
    errors: Partial<
      Record<keyof CreateResourceStep2Schema, { message?: string }>
    >;
  };
  urlDisplay: string;
  collections: Collection[];
  categories: Category[];
  isCreating: boolean;
  onBack: () => void;
  onOpenCreateCategory: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ResourceDialogStepDetailsForm({
  control,
  formState,
  urlDisplay,
  collections,
  categories,
  isCreating,
  onBack,
  onOpenCreateCategory,
  onSubmit,
}: ResourceDialogStepDetailsFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      <FieldGroupApp<CreateResourceStep2Schema>
        control={control}
        name="title"
        label="Título"
        placeholder="Título do recurso"
        className="rounded-xl"
      />
      <FieldGroupApp<CreateResourceStep2Schema>
        control={control}
        name="description"
        label="Descrição (opcional)"
        placeholder="Descrição"
        className="rounded-xl"
      />
      <Field data-slot="field-set" className="flex flex-col gap-1">
        <FieldLabel>URL</FieldLabel>
        <p className="text-sm text-muted-foreground truncate rounded-xl border bg-muted/30 px-3 py-2">
          {urlDisplay}
        </p>
      </Field>

      <Field data-slot="field-set" className="flex flex-col gap-2">
        <FieldLabel>Coleção</FieldLabel>
        <Controller
          name="collectionId"
          control={control}
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
                {collections.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{formState.errors.collectionId?.message}</FieldError>
      </Field>

      <Field data-slot="field-set" className="flex flex-col gap-2">
        <FieldLabel>Categorias (selecione ou crie ao menos uma)</FieldLabel>
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Você ainda não tem categorias. Crie uma nova para continuar.
          </p>
        )}
        <Controller
          name="categoryIds"
          control={control}
          render={({ field }) => {
            const selectedCategoryId = field.value[0] ?? "";
            return (
              <Select
                value={selectedCategoryId || "__none__"}
                onValueChange={(value) => {
                  if (value === "__create__") {
                    onOpenCreateCategory();
                    return;
                  }
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
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="__create__">
                    + Criar nova categoria...
                  </SelectItem>
                </SelectContent>
              </Select>
            );
          }}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            rounded="full"
            onClick={onOpenCreateCategory}
          >
            + Criar nova categoria
          </Button>
        </div>
        <FieldError>{formState.errors.categoryIds?.message}</FieldError>
      </Field>

      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          rounded="full"
          onClick={onBack}
        >
          Voltar
        </Button>
        <Button type="submit" rounded="full" disabled={isCreating}>
          {isCreating ? (
            <>
              <Icon icon={Loading02Icon} className="mr-2 size-4 animate-spin" />
              Criando...
            </>
          ) : (
            "Criar recurso"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
