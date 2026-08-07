"use client";

import type {
  WorkspacePermission,
  WorkspaceResource,
} from "@refstash/shared";
import { workspaceStatements } from "@refstash/shared";
import { useQuery } from "@tanstack/react-query";
import { useWorkspace } from "@/context/workspace";
import { authClient } from "@/lib/auth-client";

type PermissionCheck = {
  [K in WorkspaceResource]?: Array<(typeof workspaceStatements)[K][number]>;
};

/**
 * Checa permissões do membro atual no workspace ativo.
 * Faz batch de checks via hasPermission (uma query por conjunto solicitado).
 */
export function useWorkspacePermissions(checks: PermissionCheck) {
  const { workspaceId } = useWorkspace();

  const entries = Object.entries(checks).flatMap(([resource, actions]) =>
    (actions ?? []).map((action) => `${resource}:${action}`),
  );
  const queryKey = ["workspace-permissions", workspaceId, ...entries.sort()];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const results: Record<string, boolean> = {};
      await Promise.all(
        Object.entries(checks).flatMap(([resource, actions]) =>
          (actions ?? []).map(async (action) => {
            const key = `${resource}:${action}`;
            const res = await authClient.organization.hasPermission({
              organizationId: workspaceId,
              permissions: {
                [resource]: [action],
              } as WorkspacePermission,
            });
            results[key] = res.data?.success === true;
          }),
        ),
      );
      return results;
    },
    enabled: !!workspaceId && entries.length > 0,
    staleTime: 1000 * 60 * 2,
  });

  function can(
    resource: WorkspaceResource,
    action: string,
  ): boolean {
    if (query.isLoading || !query.data) return false;
    return query.data[`${resource}:${action}`] === true;
  }

  return {
    ...query,
    can,
    /** Atalhos comuns */
    canInvite: can("invitation", "create"),
    canUpdateMember: can("member", "update"),
    canRemoveMember: can("member", "delete"),
    canManageRoles: can("ac", "create"),
    canUpdateWorkspace: can("workspaceSettings", "update"),
    canUpdateAiSettings: can("aiSettings", "update"),
  };
}

/** Checks padrão para settings / membros */
export const SETTINGS_PERMISSION_CHECKS = {
  invitation: ["create"],
  member: ["update", "delete"],
  ac: ["create", "read", "update", "delete"],
  workspaceSettings: ["update"],
  organization: ["update", "delete"],
  aiSettings: ["update"],
} as const satisfies PermissionCheck;
