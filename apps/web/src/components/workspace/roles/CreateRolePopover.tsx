"use client";

import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useWorkspaceRoles } from "@/hook/workspace/useWorkspaceRoles";
import { cn } from "@/lib/utils";

interface CreateRolePopoverProps {
  /** Chamado após criar com sucesso, com o nome do cargo. */
  onCreated?: (roleName: string) => void;
  className?: string;
}

export function CreateRolePopover({
  onCreated,
  className,
}: CreateRolePopoverProps) {
  const { createRole, isCreating } = useWorkspaceRoles();
  const [open, setOpen] = useState(false);
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
      setOpen(false);
      onCreated?.(trimmed);
    } catch {
      // toast no hook
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setRoleName("");
      }}
    >
      <PopoverTrigger
        render={
          <Button
            variant="secondary"
            className={cn("min-w-0", className)}
            aria-label="Novo cargo"
          >
            <Icon icon={PlusSignIcon} />
            Novo cargo
          </Button>
        }
      />
      <PopoverContent className="w-80" align="end">
        <PopoverHeader>
          <PopoverTitle>Novo cargo</PopoverTitle>
          <PopoverDescription>
            Crie o cargo vazio e configure as permissões no painel.
          </PopoverDescription>
        </PopoverHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="role-name">Nome do cargo</Label>
            <Input
              id="role-name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="ex: editor"
              disabled={isCreating}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating || !roleName.trim()}>
              {isCreating ? "Criando..." : "Criar e configurar"}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
