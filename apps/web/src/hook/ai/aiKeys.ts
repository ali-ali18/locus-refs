export const aiKeys = {
  settings: (workspaceId: string) => ["ai", "settings", workspaceId] as const,
  models: (workspaceId: string) => ["ai", "models", workspaceId] as const,
};
