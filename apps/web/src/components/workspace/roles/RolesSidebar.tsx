"use client";

import { Delete02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { useMemo, useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { WorkspaceRoleItem } from "@/hook/workspace/useWorkspaceRoles";
import { cn } from "@/lib/utils";
import { countPermissions } from "./permission-utils";

interface RolesSidebarProps {
  roles: WorkspaceRoleItem[];
  selectedRole: string | null;
  isLoading: boolean;
  canDelete: boolean;
  onSelect: (roleName: string) => void;
  onDelete: (role: WorkspaceRoleItem) => void;
  className?: string;
}

export function RolesSidebar({
  roles,
  selectedRole,
  isLoading,
  canDelete,
  onSelect,
  onDelete,
  className,
}: RolesSidebarProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.role.toLowerCase().includes(q) || r.label.toLowerCase().includes(q),
    );
  }, [roles, query]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Cargos
        </p>
      </div>

      <div className="relative">
        <Icon
          icon={Search01Icon}
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar..."
          className="rounded-xl pl-8"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-2xl" />
            ))
          : filtered.map((role) => {
              const active = selectedRole === role.role;
              return (
                <div key={role.id} className="group flex items-center gap-1">
                  <Button
                    type="button"
                    variant={active ? "default" : "secondary"}
                    className="h-auto min-w-0 flex-1 justify-start px-3 py-2.5 text-left"
                    onClick={() => onSelect(role.role)}
                  >
                    <span className="flex min-w-0 flex-col items-start gap-0.5">
                      <span className="truncate capitalize">
                        {role.label}
                        {role.isBase ? " · Padrão" : ""}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-normal",
                          active
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground",
                        )}
                      >
                        {countPermissions(role.permission)} permissões
                      </span>
                    </span>
                  </Button>
                  {!role.isBase && canDelete ? (
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="secondary"
                      className="opacity-0 group-hover:opacity-100"
                      aria-label={`Excluir ${role.label}`}
                      onClick={() => onDelete(role)}
                    >
                      <Icon icon={Delete02Icon} />
                    </Button>
                  ) : null}
                </div>
              );
            })}
      </div>
    </div>
  );
}
