"use client";

import type { WorkspacePermission } from "@refstash/shared";
import {
  BASE_ROLE_LABELS,
  BASE_ROLE_NAMES,
  isBaseRole,
} from "@refstash/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/workspace";
import { authClient } from "@/lib/auth-client";
import {
  adminPermissions,
  memberPermissions,
  ownerPermissions,
} from "@/lib/workspace-access";

export type WorkspaceRoleItem = {
  id: string;
  role: string;
  permission: WorkspacePermission;
  isBase: boolean;
  label: string;
};

const BASE_PERMISSIONS: Record<
  (typeof BASE_ROLE_NAMES)[number],
  WorkspacePermission
> = {
  owner: ownerPermissions,
  admin: adminPermissions,
  member: memberPermissions,
};

function normalizePermission(
  raw: unknown,
): WorkspacePermission {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as WorkspacePermission;
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as WorkspacePermission;
    } catch {
      return {};
    }
  }
  return {};
}

export function useWorkspaceRoles() {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  const rolesKey = ["workspace-roles", workspaceId];

  const query = useQuery({
    queryKey: rolesKey,
    queryFn: async () => {
      const res = await authClient.organization.listRoles({
        query: { organizationId: workspaceId },
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Erro ao listar cargos");
      }

      const customRoles: WorkspaceRoleItem[] = (
        res.data ?? []
      ).map((item) => {
        const roleName =
          typeof item === "object" && item && "role" in item
            ? String((item as { role: string }).role)
            : String(item);
        const permission =
          typeof item === "object" && item && "permission" in item
            ? normalizePermission((item as { permission: unknown }).permission)
            : {};
        const id =
          typeof item === "object" && item && "id" in item
            ? String((item as { id: string }).id)
            : roleName;

        return {
          id,
          role: roleName,
          permission,
          isBase: false,
          label: roleName,
        };
      });

      const baseRoles: WorkspaceRoleItem[] = BASE_ROLE_NAMES.map((name) => ({
        id: `base:${name}`,
        role: name,
        permission: BASE_PERMISSIONS[name],
        isBase: true,
        label: BASE_ROLE_LABELS[name],
      }));

      // Evita duplicar se o plugin também listar roles base
      const customOnly = customRoles.filter((r) => !isBaseRole(r.role));

      return [...baseRoles, ...customOnly];
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });

  const createMutation = useMutation({
    mutationFn: async ({
      role,
      permission,
    }: {
      role: string;
      permission: WorkspacePermission;
    }) => {
      const res = await authClient.organization.createRole({
        organizationId: workspaceId,
        role,
        permission,
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Erro ao criar cargo");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Cargo criado.");
      queryClient.invalidateQueries({ queryKey: rolesKey });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao criar cargo");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (input: {
      roleId?: string;
      roleName?: string;
      data: { roleName?: string; permission?: WorkspacePermission };
    }) => {
      const res = await authClient.organization.updateRole({
        organizationId: workspaceId,
        roleId: input.roleId,
        roleName: input.roleName,
        data: input.data,
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Erro ao atualizar cargo");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Cargo atualizado.");
      queryClient.invalidateQueries({ queryKey: rolesKey });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao atualizar cargo");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({
      roleId,
      roleName,
    }: {
      roleId?: string;
      roleName?: string;
    }) => {
      const res = await authClient.organization.deleteRole({
        organizationId: workspaceId,
        ...(roleId ? { roleId } : { roleName: roleName! }),
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Erro ao excluir cargo");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Cargo excluído.");
      queryClient.invalidateQueries({ queryKey: rolesKey });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao excluir cargo");
    },
  });

  /** Cargos atribuíveis em convite/alteração (sem owner). */
  const assignableRoles =
    query.data?.filter((r) => r.role !== "owner") ?? [];

  return {
    ...query,
    roles: query.data ?? [],
    assignableRoles,
    createRole: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateRole: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteRole: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
