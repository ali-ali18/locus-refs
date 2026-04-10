"use client";

import { Loading02Icon, Tag01Icon } from "@hugeicons/core-free-icons";
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
import { cn } from "@/lib/utils";
import { InputGroupApp } from "@/components/base";

interface CreateCategoryInlineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newCategoryName: string;
  onNameChange: (value: string) => void;
  isCreating: boolean;
  onCreate: () => void;
}

export function CreateCategoryInlineDialog({
  open,
  onOpenChange,
  newCategoryName,
  onNameChange,
  isCreating,
  onCreate,
}: CreateCategoryInlineDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md")}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Nova categoria
          </DialogTitle>
          <DialogDescription>
            Crie uma categoria e já use no recurso.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <InputGroupApp
            className="rounded-xl	h-11"
            type="text"
            value={newCategoryName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Nome da categoria"
            disabled={isCreating}
            aria-label="Nome da categoria"
            firstElement={<Icon icon={Tag01Icon} />}
          />
        </div>

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
            type="button"
            rounded="full"
            disabled={!newCategoryName.trim() || isCreating}
            onClick={onCreate}
          >
            {isCreating ? (
              <>
                <Icon
                  icon={Loading02Icon}
                  className="mr-2 size-4 animate-spin"
                />
                Criando...
              </>
            ) : (
              "Criar categoria"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
