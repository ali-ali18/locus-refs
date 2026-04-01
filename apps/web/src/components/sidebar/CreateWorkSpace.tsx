import type { Dispatch, SetStateAction } from "react";
import { FormCreateWorkspace } from "@/components/workspace/FormCreateWorkspace";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface Props {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function CreateWorkSpace({ open, onOpenChange }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Criando um novo workspace</AlertDialogTitle>
          <AlertDialogDescription>
            Um workspace é onde você e sua equipe colaboram.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormCreateWorkspace onSuccess={() => onOpenChange(false)} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
