"use client";

import {
  LayoutGridIcon,
  Loading02Icon,
  Trash2,
} from "@hugeicons/core-free-icons";
import { Icon } from "@/components/shared/Icon";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteBoardDialogProps {
  boardId: string;
  boardTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void> | void;
  isPending?: boolean;
}

export function DeleteBoardDialog({
  boardId,
  boardTitle,
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: DeleteBoardDialogProps) {
  async function handleConfirm() {
    try {
      await onConfirm(boardId);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex items-center gap-2">
              <Icon icon={LayoutGridIcon} className="text-primary" />
              Deletar board
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a deletar{" "}
            <strong className="text-foreground">{boardTitle}</strong>. Essa ação
            não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            rounded="full"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Icon
                  icon={Loading02Icon}
                  className="mr-2 size-4 animate-spin"
                />
                <span className="sr-only">Deletando board...</span>
                <span aria-hidden>Deletando...</span>
              </>
            ) : (
              <>
                <Icon icon={Trash2} className="mr-2 size-4" />
                Deletar
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
