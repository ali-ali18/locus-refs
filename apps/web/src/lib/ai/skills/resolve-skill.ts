import "server-only";

import prisma from "@/lib/prisma";
import { getAgentSkill } from "@/lib/ai/skills";

export interface ResolvedAgentSkill {
  id: string;
  label: string;
  prompt: string;
  requiresNote: boolean;
  source: "builtin" | "user";
}

export async function resolveAgentSkill(options: {
  skillId: string | undefined;
  userId: string;
  workspaceId: string;
}): Promise<ResolvedAgentSkill | null> {
  const { skillId, userId, workspaceId } = options;
  if (!skillId) return null;

  const builtin = getAgentSkill(skillId);
  if (builtin) {
    return {
      id: builtin.id,
      label: builtin.label,
      prompt: builtin.prompt,
      requiresNote: builtin.requiresNote,
      source: "builtin",
    };
  }

  const skill = await prisma.agentSkill.findFirst({
    where: {
      id: skillId,
      OR: [
        { visibility: "personal", userId },
        { visibility: "workspace", workspaceId },
      ],
    },
  });

  if (!skill) return null;

  return {
    id: skill.id,
    label: skill.title,
    prompt: skill.prompt,
    requiresNote: skill.requiresNote,
    source: "user",
  };
}
