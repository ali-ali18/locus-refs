"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Folder01Icon, Loading02Icon } from "@hugeicons/core-free-icons";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FieldGroupApp } from "@/components/base";
import { ColorPickerPredefined } from "@/components/kibo-ui/color-picker/ColorPickerPredefined";
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
import { useCollections } from "../../hook/collections/useCollections";

interface EditCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
  currentName: string;
  currentDescription?: string;
  currentColor?: string;
}

export function EditCollectionDialog({
  open,
  onOpenChange,
  collectionId,
  currentName,
  currentDescription,
  currentColor,
}: EditCollectionDialogProps) {
  const { updateCollection, isUpdating } = useCollections();
  const [pickerColor, setPickerColor] = useState<string>(
    currentColor ?? "#3b82f6",
  );

  const form = useForm<CreateCollectionSchema>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: { name: currentName, description: currentDescription ?? "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: currentName,
        description: currentDescription ?? "",
      });
      setPickerColor(currentColor ?? "#3b82f6");
    }
  }, [open, currentName, currentDescription, currentColor, form]);

  const handleColorChange = useCallback((color: string) => {
    setPickerColor(color);
  }, []);

  const onSubmit = async (data: CreateCollectionSchema) => {
    try {
      await updateCollection({
        id: collectionId,
        name: data.name,
        description: data.description,
        color: pickerColor,
      });
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
          <DialogDescription>Altere os dados da coleção.</DialogDescription>
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
            <ColorPickerPredefined
              value={pickerColor}
              onChange={handleColorChange}
            />
          </Field>

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
