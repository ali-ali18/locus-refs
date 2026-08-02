export type AgentSkillVisibility = "personal" | "workspace";

export interface AgentSkill {
  id: string;
  title: string;
  description: string | null;
  prompt: string;
  requiresNote: boolean;
  visibility: AgentSkillVisibility;
  userId: string;
  workspaceId: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    image: string | null;
  };
}
