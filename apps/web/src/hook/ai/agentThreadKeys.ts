export const agentThreadKeys = {
  all: (workspaceId: string) => ["agent-threads", workspaceId] as const,
  detail: (workspaceId: string, id: string) =>
    ["agent-threads", workspaceId, id] as const,
};

export function activeThreadStorageKey(workspaceId: string): string {
  return `agent:activeThread:${workspaceId}`;
}
