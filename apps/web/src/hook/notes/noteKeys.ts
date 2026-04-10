export const noteKeys = {
  all: (workspaceId: string) => ["notes", workspaceId] as const,
  detail: (workspaceId: string, id: string) => ["notes", workspaceId, id] as const,
};
