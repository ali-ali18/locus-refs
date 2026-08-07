"use client";

import { ArrowRight01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettingsDialog } from "@/context/settingsDialog";
import { useWorkspace } from "@/context/workspace";
import {
  SETTINGS_PERMISSION_CHECKS,
  useWorkspacePermissions,
} from "@/hook/workspace/useWorkspacePermissions";
import { useWorkspaceRoles } from "@/hook/workspace/useWorkspaceRoles";
import { countPermissions } from "./permission-utils";
import { RoleFormDialog } from "./RoleFormDialog";

export function WorkspaceRolesList() {
  const router = useRouter();
  const { workspaceSlug } = useWorkspace();
  const { closeSettings } = useSettingsDialog();
  const { roles, isLoading } = useWorkspaceRoles();
  const { canManageRoles } = useWorkspacePermissions(
    SETTINGS_PERMISSION_CHECKS,
  );
  const [createOpen, setCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Selecione um cargo para abrir o painel de permissões.
        </p>
        {canManageRoles ? (
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Icon icon={PlusSignIcon} />
            Novo cargo
          </Button>
        ) : null}
      </div>

      <ItemGroup>
        {roles.map((role) => (
          <Item variant="outline" key={role.id} className="gap-2">
            <ItemContent className="gap-0.5">
              <ItemTitle className="flex items-center gap-2">
                <span className="capitalize">{role.label}</span>
                {role.isBase ? <Badge variant="outline">Padrão</Badge> : null}
              </ItemTitle>
              <ItemDescription>
                {countPermissions(role.permission)} permissões
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={
                  <Link
                    href={`/${workspaceSlug}/roles?role=${encodeURIComponent(role.role)}`}
                    onClick={() => closeSettings()}
                  />
                }
              >
                Abrir painel
                <Icon icon={ArrowRight01Icon} />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>

      <RoleFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(roleName) => {
          closeSettings();
          router.push(
            `/${workspaceSlug}/roles?role=${encodeURIComponent(roleName)}`,
          );
        }}
      />
    </section>
  );
}
