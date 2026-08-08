"use client";

import { Menu01FreeIcons } from "@hugeicons/core-free-icons";
import type { WorkspacePermission } from "@refstash/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettingsDialog } from "@/context/settingsDialog";
import { useWorkspace } from "@/context/workspace";
import { useIsMobile } from "@/hook/use-mobile";
import {
  SETTINGS_PERMISSION_CHECKS,
  useWorkspacePermissions,
} from "@/hook/workspace/useWorkspacePermissions";
import {
  useWorkspaceRoles,
  type WorkspaceRoleItem,
} from "@/hook/workspace/useWorkspaceRoles";
import { CreateRolePopover } from "./CreateRolePopover";
import { DeleteRoleDialog } from "./DeleteRoleDialog";
import {
  cleanPermission,
  emptyPermissionMap,
  permissionsEqual,
} from "./permission-utils";
import { RolePermissionModules } from "./RolePermissionModules";
import { RolesSidebar } from "./RolesSidebar";

export function RolesControlPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const { workspaceSlug } = useWorkspace();
  const { closeSettings } = useSettingsDialog();
  const { roles, isLoading, updateRole, isUpdating } = useWorkspaceRoles();
  const {
    can,
    canManageRoles,
    isLoading: permsLoading,
  } = useWorkspacePermissions(SETTINGS_PERMISSION_CHECKS);

  const canRead = can("ac", "read") || canManageRoles;
  const canUpdate = can("ac", "update") || canManageRoles;
  const canDelete = can("ac", "delete") || canManageRoles;
  const canCreate = canManageRoles;

  const roleParam = searchParams.get("role");
  const selectedRoleName = roleParam ?? roles[0]?.role ?? null;

  const selectedRole: WorkspaceRoleItem | null = useMemo(
    () => roles.find((r) => r.role === selectedRoleName) ?? null,
    [roles, selectedRoleName],
  );

  const [draft, setDraft] = useState<WorkspacePermission>(emptyPermissionMap());
  const [deletingRole, setDeletingRole] = useState<WorkspaceRoleItem | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (permsLoading) return;
    if (!canRead) {
      router.replace(`/${workspaceSlug}`);
    }
  }, [canRead, permsLoading, router, workspaceSlug]);

  useEffect(() => {
    if (!selectedRole) return;
    setDraft({ ...emptyPermissionMap(), ...selectedRole.permission });
  }, [selectedRole]);

  useEffect(() => {
    if (isLoading || roles.length === 0) return;
    if (roleParam && !roles.some((r) => r.role === roleParam)) {
      router.replace(`/${workspaceSlug}/roles?role=${roles[0].role}`);
    }
    if (!roleParam) {
      router.replace(`/${workspaceSlug}/roles?role=${roles[0].role}`);
    }
  }, [isLoading, roleParam, roles, router, workspaceSlug]);

  const readOnly = !selectedRole || selectedRole.isBase || !canUpdate;
  const dirty =
    selectedRole != null &&
    !selectedRole.isBase &&
    !permissionsEqual(draft, selectedRole.permission);

  function selectRole(roleName: string) {
    router.replace(
      `/${workspaceSlug}/roles?role=${encodeURIComponent(roleName)}`,
    );
    setSidebarOpen(false);
  }

  async function handleSave() {
    if (!selectedRole || selectedRole.isBase || !dirty) return;
    await updateRole({
      roleId: selectedRole.id.startsWith("base:") ? undefined : selectedRole.id,
      roleName: selectedRole.role,
      data: { permission: cleanPermission(draft) },
    });
  }

  if (permsLoading || (isLoading && roles.length === 0)) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[60vh] w-full" />
      </div>
    );
  }

  if (!canRead) return null;

  const sidebar = (
    <RolesSidebar
      roles={roles}
      selectedRole={selectedRoleName}
      isLoading={isLoading}
      canDelete={canDelete}
      onSelect={selectRole}
      onDelete={(role) => {
        setDeletingRole(role);
        setSidebarOpen(false);
      }}
    />
  );

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-7 p-4 md:p-6 lg:p-8">
      <header className="flex flex-col gap-5">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Cargos e permissões
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Defina o que cada cargo pode acessar e editar no workspace.
            </p>
          </div>

          <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 sm:w-auto">
            {isMobile ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-w-0 flex-1 sm:flex-none"
                onClick={() => setSidebarOpen(true)}
              >
                <Icon icon={Menu01FreeIcons} />
                Cargos
              </Button>
            ) : null}

            {canCreate ? (
              <CreateRolePopover
                className="flex-1 sm:flex-none"
                onCreated={(roleName) => {
                  closeSettings();
                  selectRole(roleName);
                }}
              />
            ) : null}

            <Button
              type="button"
              className="min-w-0 flex-1 sm:flex-none"
              disabled={!dirty || readOnly || isUpdating}
              onClick={handleSave}
            >
              {isUpdating
                ? "Salvando..."
                : dirty
                  ? "Salvar alterações"
                  : "Tudo salvo"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex w-full min-w-0 items-start gap-10">
        <aside className="hidden w-[240px] shrink-0 lg:block">{sidebar}</aside>

        <section className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex min-w-0 flex-wrap items-center gap-2 border-b border-border pb-4">
            <h2 className="min-w-0 truncate text-lg font-semibold capitalize">
              {selectedRole?.label ?? "Selecione um cargo"}
            </h2>
            {selectedRole?.isBase ? (
              <Badge variant="secondary">Somente leitura</Badge>
            ) : null}
            {dirty ? (
              <Badge variant="secondary">Alterações não salvas</Badge>
            ) : null}
          </div>

          {selectedRole ? (
            <RolePermissionModules
              permission={draft}
              readOnly={readOnly}
              onChange={setDraft}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum cargo selecionado.
            </p>
          )}
        </section>
      </div>

      <Drawer
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        swipeDirection="down"
      >
        <DrawerContent className="data-[swipe-axis=y]:[--drawer-content-height:auto] data-[swipe-axis=y]:[--drawer-content-max-height:calc(100dvh-6rem)]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Cargos</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {sidebar}
          </div>
        </DrawerContent>
      </Drawer>

      <DeleteRoleDialog
        role={deletingRole}
        open={deletingRole != null}
        onOpenChange={(open) => {
          if (!open) setDeletingRole(null);
        }}
        onDeleted={(deletedName) => {
          if (selectedRoleName === deletedName) {
            const next = roles.find((r) => r.role !== deletedName);
            if (next) selectRole(next.role);
          }
        }}
      />
    </div>
  );
}
