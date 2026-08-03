export const kanbanKeys = {
  all: (workspaceId: string) => ["kanban", workspaceId] as const,
  detail: (workspaceId: string, id: string) =>
    ["kanban", workspaceId, id] as const,
};
