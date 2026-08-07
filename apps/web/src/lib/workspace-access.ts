import type { WorkspacePermission } from "@refstash/shared";
import { workspaceStatements } from "@refstash/shared";

type FullPermissionMap = {
  [K in keyof typeof workspaceStatements]: Array<
    (typeof workspaceStatements)[K][number]
  >;
};

function allActions(): FullPermissionMap {
  return {
    organization: [...workspaceStatements.organization],
    member: [...workspaceStatements.member],
    invitation: [...workspaceStatements.invitation],
    team: [...workspaceStatements.team],
    ac: [...workspaceStatements.ac],
    note: [...workspaceStatements.note],
    collection: [...workspaceStatements.collection],
    resource: [...workspaceStatements.resource],
    category: [...workspaceStatements.category],
    board: [...workspaceStatements.board],
    kanban: [...workspaceStatements.kanban],
    calendar: [...workspaceStatements.calendar],
    agentThread: [...workspaceStatements.agentThread],
    agentSkill: [...workspaceStatements.agentSkill],
    aiSettings: [...workspaceStatements.aiSettings],
    workspaceSettings: [...workspaceStatements.workspaceSettings],
  };
}

/** Permissões do owner — tudo. */
export const ownerPermissions: WorkspacePermission = allActions();

/** Admin: tudo menos deletar o workspace. */
export const adminPermissions: WorkspacePermission = {
  ...allActions(),
  organization: ["update"],
};

/**
 * Member: CRUD de conteúdo (como hoje).
 * Sem gerenciar membros/convites/cargos/settings; sem update/delete de board;
 * sem delete de kanban; sem manageWorkspace em calendar.
 */
export const memberPermissions: WorkspacePermission = {
  note: ["create", "read", "update", "delete"],
  collection: ["create", "read", "update", "delete"],
  resource: ["create", "read", "update", "delete"],
  category: ["create", "read", "update", "delete"],
  board: ["create", "read"],
  kanban: ["create", "read", "update"],
  calendar: ["create", "read", "update", "delete"],
  agentThread: ["create", "read", "update", "share"],
  agentSkill: ["create", "read", "update", "delete"],
  aiSettings: ["read"],
};
