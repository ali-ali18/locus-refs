"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspaceRoles } from "@/hook/workspace/useWorkspaceRoles";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Chamado após criar com sucesso, com o nome do cargo. */
  onCreated?: (roleName: string) => void;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  onCreated,
}: RoleFormDialogProps) {
  const { createRole, isCreating } = useWorkspaceRoles();
  const [roleName, setRoleName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = roleName.trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9_-]*$/i.test(trimmed)) {
      toast.error("Nome inválido. Use letras, números, hífen ou underscore.");
      return;
    }

    try {
      await createRole({ role: trimmed, permission: {} });
      setRoleName("");
      onOpenChange(false);
      onCreated?.(trimmed);
    } catch {
      // toast no hook
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setRoleName("");
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo cargo</DialogTitle>
          <DialogDescription>
            Crie o cargo vazio e configure as permissões no painel.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="role-name">Nome do cargo</Label>
            <Input
              id="role-name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="ex: editor"
              disabled={isCreating}
              className="rounded-xl"
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating || !roleName.trim()}>
              {isCreating ? "Criando..." : "Criar e configurar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
