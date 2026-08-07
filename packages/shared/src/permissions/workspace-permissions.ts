/**
 * Catálogo de permissões do workspace.
 *
 * Inclui os statements padrão do Better Auth organization plugin
 * (organization, member, invitation, team, ac) como literais — sem
 * depender de better-auth neste pacote — mais os recursos do domínio Refstash.
 */

export const BASE_ROLE_NAMES = ["owner", "admin", "member"] as const;
export type BaseRoleName = (typeof BASE_ROLE_NAMES)[number];

export function isBaseRole(role: string): role is BaseRoleName {
  return (BASE_ROLE_NAMES as readonly string[]).includes(role);
}

/** Statements alinhados a better-auth/plugins/organization/access defaultStatements */
export const organizationDefaultStatements = {
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  team: ["create", "update", "delete"],
  ac: ["create", "read", "update", "delete"],
} as const;

export const workspaceAppStatements = {
  note: ["create", "read", "update", "delete"],
  collection: ["create", "read", "update", "delete"],
  resource: ["create", "read", "update", "delete"],
  category: ["create", "read", "update", "delete"],
  board: ["create", "read", "update", "delete"],
  kanban: ["create", "read", "update", "delete"],
  calendar: ["create", "read", "update", "delete", "manageWorkspace"],
  agentThread: ["create", "read", "update", "delete", "share"],
  agentSkill: ["create", "read", "update", "delete", "shareWorkspace"],
  aiSettings: ["read", "update"],
  workspaceSettings: ["update"],
} as const;

export const workspaceStatements = {
  ...organizationDefaultStatements,
  ...workspaceAppStatements,
} as const;

export type WorkspaceStatements = typeof workspaceStatements;
export type WorkspaceResource = keyof WorkspaceStatements;
export type WorkspaceAction<R extends WorkspaceResource = WorkspaceResource> =
  WorkspaceStatements[R][number];

/** Permissões no formato Better Auth: Record<resource, actions[]> */
export type WorkspacePermission = {
  [K in WorkspaceResource]?: Array<WorkspaceStatements[K][number]>;
};

export const PERMISSION_RESOURCE_LABELS: Record<WorkspaceResource, string> = {
  organization: "Workspace",
  member: "Membros",
  invitation: "Convites",
  team: "Times",
  ac: "Cargos e permissões",
  note: "Notas",
  collection: "Coleções",
  resource: "Recursos",
  category: "Categorias",
  board: "Boards",
  kanban: "Kanban",
  calendar: "Calendário",
  agentThread: "Threads do agente",
  agentSkill: "Skills do agente",
  aiSettings: "Configurações de IA",
  workspaceSettings: "Configurações do workspace",
};

export const PERMISSION_ACTION_LABELS: Record<string, string> = {
  create: "Criar",
  read: "Ler",
  update: "Editar",
  delete: "Excluir",
  cancel: "Cancelar",
  manageWorkspace: "Gerenciar eventos do workspace",
  share: "Compartilhar",
  shareWorkspace: "Compartilhar no workspace",
};

/** Recursos exibidos na UI de edição de cargo (omite team, pouco usado) */
export const EDITABLE_PERMISSION_RESOURCES = [
  "note",
  "collection",
  "resource",
  "category",
  "board",
  "kanban",
  "calendar",
  "agentThread",
  "agentSkill",
  "aiSettings",
  "workspaceSettings",
  "member",
  "invitation",
  "organization",
  "ac",
] as const satisfies readonly WorkspaceResource[];

export type EditablePermissionResource =
  (typeof EDITABLE_PERMISSION_RESOURCES)[number];

export function isEditablePermissionResource(
  resource: WorkspaceResource,
): resource is EditablePermissionResource {
  return (EDITABLE_PERMISSION_RESOURCES as readonly WorkspaceResource[]).includes(
    resource,
  );
}

export const BASE_ROLE_LABELS: Record<BaseRoleName, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Membro",
};
