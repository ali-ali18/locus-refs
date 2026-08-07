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
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";
import {
  type WorkspaceRoleItem,
  useWorkspaceRoles,
} from "@/hook/workspace/useWorkspaceRoles";

interface DeleteRoleDialogProps {
  role: WorkspaceRoleItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: (roleName: string) => void;
}

export function DeleteRoleDialog({
  role,
  open,
  onOpenChange,
  onDeleted,
}: DeleteRoleDialogProps) {
  const { deleteRole, isDeleting } = useWorkspaceRoles();
  const { allMembers } = useWorkspaceMembers();

  const membersWithRole =
    role == null
      ? []
      : (allMembers?.filter((m) => m.role === role.role) ?? []);
  const blocked = membersWithRole.length > 0;

  async function handleConfirm() {
    if (!role || blocked) return;
    const roleName = role.role;
    try {
      await deleteRole({ roleId: role.id, roleName: role.role });
      onOpenChange(false);
      onDeleted?.(roleName);
    } catch {
      // toast no hook
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir cargo</AlertDialogTitle>
          <AlertDialogDescription>
            {blocked ? (
              <>
                Não é possível excluir <strong>{role?.label ?? role?.role}</strong>{" "}
                enquanto {membersWithRole.length}{" "}
                {membersWithRole.length === 1 ? "membro usa" : "membros usam"}{" "}
                este cargo. Altere o cargo deles antes.
              </>
            ) : (
              <>
                Tem certeza que deseja excluir o cargo{" "}
                <strong>{role?.label ?? role?.role}</strong>? Esta ação não pode
                ser desfeita.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={blocked || isDeleting || !role}
            onClick={handleConfirm}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
