"use client";

import { File01Icon, Loading02Icon } from "@hugeicons/core-free-icons";
import { Controller } from "react-hook-form";
import { FieldGroupApp } from "@/components/base";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { IconPicker } from "./IconPicker";
import { useFormCreateNote } from "./hooks/useFormCreateNote";

export function FormCreateNote() {
  const { form, onSubmit, isLoading } = useFormCreateNote();

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroupApp
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
            <span className="text-sm font-medium text-foreground">Ícone</span>
            <IconPicker
              value={field.value || null}
              onChange={(name) => field.onChange(name ?? "")}
            />
          </div>
        )}
      />

      <DialogFooter>
        <DialogClose
          render={
            <Button variant="outline" rounded="full">
              Cancelar
            </Button>
          }
        >
          Cancelar
        </DialogClose>
        <Button type="submit" rounded="full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Icon icon={Loading02Icon} className="mr-2 size-4 animate-spin" />
              <span className="sr-only">Criando nota...</span>
              <span aria-hidden>Criando...</span>
            </>
          ) : (
            "Criar nota"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
