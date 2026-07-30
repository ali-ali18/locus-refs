"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo } from "react";
import {
  type AgentMention,
  type AiUIMessage,
  useAiChat,
} from "@/components/chat/hook/useAiChat";
import type { AgentSkillId } from "@/lib/ai/skills";
import type { NoteEditToolName, NoteEditToolResult } from "@/lib/ai/tools";

interface AgentSessionValue {
  noteId?: string;
  messages: AiUIMessage[];
  isStreaming: boolean;
  status: "submitted" | "streaming" | "ready" | "error";
  send: (
    text: string,
    options?: { skillId?: AgentSkillId; mentions?: AgentMention[] },
  ) => void;
  clear: () => void;
  stop: () => void;
  addToolOutput: (args: {
    tool: NoteEditToolName;
    toolCallId: string;
    output: NoteEditToolResult;
  }) => void;
  addToolApprovalResponse: (args: {
    id: string;
    approved: boolean;
    reason?: string;
  }) => void | PromiseLike<void>;
}

const AgentSessionContext = createContext<AgentSessionValue | null>(null);

export function AgentSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noteId = useMemo(() => {
    const match = pathname.match(/\/notes\/([^/]+)$/);
    return match?.[1];
  }, [pathname]);

  const chat = useAiChat({ noteId });

  const value = useMemo<AgentSessionValue>(
    () => ({
      noteId,
      messages: chat.messages,
      isStreaming: chat.isStreaming,
      status: chat.status,
      send: chat.send,
      clear: chat.clear,
      stop: chat.stop,
      addToolOutput: chat.addToolOutput,
      addToolApprovalResponse: chat.addToolApprovalResponse,
    }),
    [
      noteId,
      chat.messages,
      chat.isStreaming,
      chat.status,
      chat.send,
      chat.clear,
      chat.stop,
      chat.addToolOutput,
      chat.addToolApprovalResponse,
    ],
  );

  return (
    <AgentSessionContext.Provider value={value}>
      {children}
    </AgentSessionContext.Provider>
  );
}

export function useAgentSession() {
  const ctx = useContext(AgentSessionContext);
  if (!ctx) {
    throw new Error("useAgentSession must be used within AgentSessionProvider");
  }
  return ctx;
}
