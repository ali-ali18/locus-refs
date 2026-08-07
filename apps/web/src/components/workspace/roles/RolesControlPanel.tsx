"use client";

import type { WorkspacePermission } from "@refstash/shared";
import {
  ArrowLeft01Icon,
  Menu01FreeIcons,
} from "@hugeicons/core-free-icons";
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
  type WorkspaceRoleItem,
  useWorkspaceRoles,
} from "@/hook/workspace/useWorkspaceRoles";
import { DeleteRoleDialog } from "./DeleteRoleDialog";
import { RoleFormDialog } from "./RoleFormDialog";
import { RolePermissionModules } from "./RolePermissionModules";
import { RolesSidebar } from "./RolesSidebar";
import {
  cleanPermission,
  emptyPermissionMap,
  permissionsEqual,
} from "./permission-utils";

export function RolesControlPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const { workspaceSlug } = useWorkspace();
  const { openSettings, closeSettings } = useSettingsDialog();
  const { roles, isLoading, updateRole, isUpdating } = useWorkspaceRoles();
  const { can, canManageRoles, isLoading: permsLoading } =
    useWorkspacePermissions(SETTINGS_PERMISSION_CHECKS);

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
  const [createOpen, setCreateOpen] = useState(false);
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
      roleId: selectedRole.id.startsWith("base:")
        ? undefined
        : selectedRole.id,
      roleName: selectedRole.role,
      data: { permission: cleanPermission(draft) },
    });
  }

  function handleBackToSettings() {
    router.push(`/${workspaceSlug}`);
    openSettings("workspace-roles");
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
      canCreate={canCreate}
      canDelete={canDelete}
      onSelect={selectRole}
      onCreate={() => {
        setCreateOpen(true);
        setSidebarOpen(false);
      }}
      onDelete={(role) => {
        setDeletingRole(role);
        setSidebarOpen(false);
      }}
    />
  );

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-6 p-4 md:p-6 lg:p-8">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleBackToSettings}
            aria-label="Voltar para configurações"
          >
            <Icon icon={ArrowLeft01Icon} />
          </Button>

          <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-2">
            {isMobile ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Icon icon={Menu01FreeIcons} />
                Cargos
              </Button>
            ) : null}

            <Button
              type="button"
              disabled={!dirty || readOnly || isUpdating}
              onClick={handleSave}
            >
              {isUpdating ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">
            Cargos e permissões
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha um cargo e libere o que ele pode fazer em cada recurso.
          </p>
        </div>
      </header>

      <div className="flex w-full min-w-0 items-start gap-6">
        <div className="hidden w-[260px] shrink-0 lg:block">{sidebar}</div>

        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-medium capitalize">
              {selectedRole?.label ?? "Selecione um cargo"}
            </h2>
            {selectedRole?.isBase ? (
              <Badge variant="outline">Padrão · somente leitura</Badge>
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

      <RoleFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(roleName) => {
          closeSettings();
          selectRole(roleName);
        }}
      />

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
