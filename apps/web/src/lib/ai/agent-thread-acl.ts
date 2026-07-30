import "server-only";

import type { AgentThread } from "@/generated/prisma/client";
import { isWorkspaceAdmin } from "@/server/requireSession";
import type { AgentThreadSummary } from "@/types/agent-thread.type";

export function canReadAgentThread(
  thread: Pick<AgentThread, "visibility" | "createdById">,
  userId: string,
): boolean {
  if (thread.visibility === "workspace") return true;
  return thread.createdById === userId;
}

export function canWriteAgentThread(
  thread: Pick<AgentThread, "visibility" | "createdById">,
  userId: string,
): boolean {
  return canReadAgentThread(thread, userId);
}

export function canDeleteAgentThread(
  thread: Pick<AgentThread, "createdById">,
  userId: string,
  memberRole: string,
): boolean {
  if (isWorkspaceAdmin(memberRole)) return true;
  return thread.createdById === userId;
}

/** Só o dono pode promover um chat privado para o workspace. */
export function canShareAgentThread(
  thread: Pick<AgentThread, "visibility" | "createdById">,
  userId: string,
): boolean {
  return thread.visibility === "private" && thread.createdById === userId;
}

export function toAgentThreadSummary(
  thread: AgentThread & {
    createdBy?: { name: string | null } | null;
  },
  userId: string,
  memberRole: string,
): AgentThreadSummary {
  const messages = Array.isArray(thread.messages) ? thread.messages : [];
  return {
    id: thread.id,
    title: thread.title,
    visibility: thread.visibility,
    createdById: thread.createdById,
    createdByName: thread.createdBy?.name ?? null,
    lastOpenedAt: thread.lastOpenedAt?.toISOString() ?? null,
    updatedAt: thread.updatedAt.toISOString(),
    createdAt: thread.createdAt.toISOString(),
    messageCount: messages.length,
    canDelete: canDeleteAgentThread(thread, userId, memberRole),
    canShare: canShareAgentThread(thread, userId),
  };
}
