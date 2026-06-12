export const boardKeys = {
  all: (workspaceId: string) => ["boards", workspaceId] as const,
  detail: (workspaceId: string, id: string) =>
    ["boards", workspaceId, id] as const,
};
