import type { WorkspacePermission, WorkspaceResource } from "@refstash/shared";
import {
  EDITABLE_PERMISSION_RESOURCES,
  workspaceStatements,
} from "@refstash/shared";

export function emptyPermissionMap(): WorkspacePermission {
  const map: WorkspacePermission = {};
  for (const resource of EDITABLE_PERMISSION_RESOURCES) {
    map[resource] = [];
  }
  return map;
}

export function countPermissions(permission: WorkspacePermission): number {
  return Object.values(permission).reduce(
    (sum, actions) => sum + (actions?.length ?? 0),
    0,
  );
}

export function cleanPermission(
  permission: WorkspacePermission,
): WorkspacePermission {
  const cleaned: WorkspacePermission = {};
  for (const [key, actions] of Object.entries(permission)) {
    if (actions && actions.length > 0) {
      cleaned[key as WorkspaceResource] = actions as never;
    }
  }
  return cleaned;
}

export function togglePermissionAction(
  current: WorkspacePermission,
  resource: WorkspaceResource,
  action: string,
  checked: boolean,
): WorkspacePermission {
  const existing = [...((current[resource] as string[] | undefined) ?? [])];
  const next = checked
    ? existing.includes(action)
      ? existing
      : [...existing, action]
    : existing.filter((a) => a !== action);
  return { ...current, [resource]: next as never };
}

export function setResourceActions(
  current: WorkspacePermission,
  resource: WorkspaceResource,
  actions: string[],
): WorkspacePermission {
  return { ...current, [resource]: actions as never };
}

/** Ações CRUD clássicas presentes no recurso (create/read/update/delete). */
export function crudActionsFor(resource: WorkspaceResource): string[] {
  const all = workspaceStatements[resource] as readonly string[];
  return ["create", "read", "update", "delete"].filter((a) =>
    all.includes(a),
  );
}

export function permissionsEqual(
  a: WorkspacePermission,
  b: WorkspacePermission,
): boolean {
  return (
    JSON.stringify(cleanPermission(a)) === JSON.stringify(cleanPermission(b))
  );
}
