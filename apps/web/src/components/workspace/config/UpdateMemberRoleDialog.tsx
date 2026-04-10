"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateMemberRole } from "./hooks/useUpdateMemberRole";

interface UpdateMemberRoleDialogProps {
  memberId: string;
  memberName: string;
  currentRole: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateMemberRoleDialog({
  memberId,
  memberName,
  currentRole,
  open,
  onOpenChange,
}: UpdateMemberRoleDialogProps) {
  const { selectedRole, setSelectedRole, handleConfirm, isUpdatingRole } =
    useUpdateMemberRole(memberId, currentRole, () => onOpenChange(false));

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mudança de cargo</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a realizar uma mudança de cargo para <strong>{memberName}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2">
          <Label>Cargo</Label>
          <Select
            value={selectedRole}
            onValueChange={(value) => { if (value) setSelectedRole(value); }}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Selecione um cargo" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectGroup>
                <SelectItem value="member">Membro</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectGroup>
            </SelectContent>

          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isUpdatingRole || selectedRole === currentRole}
          >
            {isUpdatingRole ? "Salvando..." : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
