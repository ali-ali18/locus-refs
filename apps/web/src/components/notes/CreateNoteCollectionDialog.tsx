"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Folder01Icon, Loading02Icon } from "@hugeicons/core-free-icons";
import Color from "color";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FieldGroupApp } from "@/components/base";
import {
  ColorPicker,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/kibo-ui/color-picker";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  type CreateCollectionSchema,
  createCollectionSchema,
} from "@refstash/shared";
import { useCollections } from "@/hook/collections/useCollections";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateNoteCollectionDialog({ open, onOpenChange }: Props) {
  const { createCollection, isCreating } = useCollections();
  const [pickerColor, setPickerColor] = useState<string>("#3b82f6");

  const form = useForm<CreateCollectionSchema>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: { name: "", description: "" },
  });

  const handleColorChange = useCallback(
    (rgba: Parameters<typeof Color.rgb>[0]) => {
      const hex = Color.rgb(rgba).hex().toLowerCase();
      setPickerColor(hex);
    },
    [],
  );

  const onSubmit = async (data: CreateCollectionSchema) => {
    try {
      await createCollection({ ...data, color: pickerColor, isNoteCollection: true });
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
            Nova coleção
          </DialogTitle>
          <DialogDescription>
            Agrupe suas notas em coleções para manter tudo organizado.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <FieldGroupApp<CreateCollectionSchema>
            control={form.control}
            align="inline-start"
            firstElement={<Icon icon={Folder01Icon} />}
            name="name"
            label="Nome da coleção"
            placeholder="Ex: Estudos, Projetos, Ideias..."
            className="rounded-xl"
          />

          <Field>
            <FieldLabel className="text-sm font-medium">
              Descrição (opcional)
            </FieldLabel>
            <Textarea
              {...form.register("description")}
              placeholder="Do que se trata essa coleção?"
              className="rounded-xl min-h-20 resize-none"
              maxLength={200}
            />
          </Field>

          <Field>
            <FieldLabel className="text-sm font-medium mb-2 flex items-center gap-2">
              Cor da coleção
              <span
                className="size-4 rounded-full border border-border inline-block"
                style={{ backgroundColor: pickerColor }}
              />
            </FieldLabel>
            <ColorPicker value={pickerColor} onChange={handleColorChange}>
              <ColorPickerSelection className="h-32 rounded-xl" />
              <ColorPickerHue />
              <div className="flex items-center gap-2">
                <ColorPickerOutput />
                <ColorPickerFormat className="flex-1" />
              </div>
            </ColorPicker>
          </Field>

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
                  <span className="sr-only">Criando...</span>
                </>
              ) : (
                "Criar coleção"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
