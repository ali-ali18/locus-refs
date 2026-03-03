"use client";

import { ArrowRight02FreeIcons, Link01Icon, Loading02Icon } from "@hugeicons/core-free-icons";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldGroupApp } from "@/components/base";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import type { CreateResourceSchema } from "@/types/resource.schema";
import type { Control } from "react-hook-form";

interface ResourceDialogStepUrlFormProps {
  control: Control<CreateResourceSchema>;
  formState: { isSubmitting: boolean };
  isFetchingMetadata: boolean;
  metadataError: Error | null;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ResourceDialogStepUrlForm({
  control,
  formState,
  isFetchingMetadata,
  metadataError,
  onCancel,
  onSubmit,
}: ResourceDialogStepUrlFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <FieldGroupApp<CreateResourceSchema>
        control={control}
        name="url"
        label="URL do recurso"
        placeholder="Ex: https://www.google.com"
        className="rounded-xl h-11"
        firstElement={<Icon icon={Link01Icon} />}
        align="inline-end"
        lastElement={
                <Button
            type="submit"
            rounded="full"
            variant="secondary"
            size="icon-sm"
            disabled={formState.isSubmitting || isFetchingMetadata}
            aria-label={isFetchingMetadata ? "Buscando metadados..." : "Buscar metadados"}
          >
            {isFetchingMetadata ? (
              <Icon
                icon={Loading02Icon}
                className="size-4 animate-spin"
                aria-hidden
              />
            ) : (
              <Icon icon={ArrowRight02FreeIcons} aria-hidden />
            )}
          </Button>
        }
      />
      {metadataError && (
        <p className="text-sm text-destructive" role="alert">
          Falha ao buscar metadados. Verifique a URL e tente novamente.
        </p>
      )}
      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          rounded="full"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </DialogFooter>
    </form>
  );
}
