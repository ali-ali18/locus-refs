export type AgentThreadVisibility = "private" | "workspace";

export type AgentThreadSummary = {
  id: string;
  title: string | null;
  visibility: AgentThreadVisibility;
  createdById: string;
  createdByName: string | null;
  lastOpenedAt: string | null;
  updatedAt: string;
  createdAt: string;
  messageCount: number;
  canDelete: boolean;
  canShare: boolean;
};
