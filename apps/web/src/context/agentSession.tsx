"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type AgentMention,
  type AiUIMessage,
  useAiChat,
} from "@/components/chat/hook/useAiChat";
import { useWorkspace } from "@/context/workspace";
import { activeThreadStorageKey } from "@/hook/ai/agentThreadKeys";
import {
  useAgentThreadMutations,
  useAgentThreads,
} from "@/hook/ai/useAgentThreads";
import type { AgentThreadSummary } from "@/types/agent-thread.type";
import type { AgentSkillId } from "@/lib/ai/skills";
import type { NoteEditToolName, NoteEditToolResult } from "@/lib/ai/tools";

interface AgentSessionValue {
  noteId?: string;
  threadId: string | null;
  threads: AgentThreadSummary[];
  isThreadsLoading: boolean;
  isCreatingThread: boolean;
  isSharing: boolean;
  activeThread: AgentThreadSummary | null;
  setActiveThreadId: (id: string | null) => void;
  /** Volta para rascunho local — não cria no banco. */
  startNewChat: () => void;
  deleteThread: (id: string) => Promise<void>;
  shareThread: (id: string) => Promise<void>;
  messages: AiUIMessage[];
  isStreaming: boolean;
  isThreadLoading: boolean;
  status: "submitted" | "streaming" | "ready" | "error";
  send: (
    text: string,
    options?: { skillId?: AgentSkillId; mentions?: AgentMention[] },
  ) => void;
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
  const { workspaceId } = useWorkspace();
  const {
    data: threads = [],
    isLoading: isThreadsLoading,
    isFetching: isThreadsFetching,
  } = useAgentThreads();
  const {
    deleteThread: deleteThreadMutation,
    shareThread: shareThreadMutation,
    isCreating,
    isSharing,
  } = useAgentThreadMutations();

  const [activeThreadId, setActiveThreadIdState] = useState<string | null>(
    null,
  );
  const [storageReady, setStorageReady] = useState(false);

  const noteId = useMemo(() => {
    const match = pathname.match(/\/notes\/([^/]+)$/);
    return match?.[1];
  }, [pathname]);

  useEffect(() => {
    if (!workspaceId) return;
    try {
      const stored = localStorage.getItem(activeThreadStorageKey(workspaceId));
      setActiveThreadIdState(stored);
    } catch {
      setActiveThreadIdState(null);
    }
    setStorageReady(true);
  }, [workspaceId]);

  const setActiveThreadId = useCallback(
    (id: string | null) => {
      setActiveThreadIdState(id);
      try {
        if (id) {
          localStorage.setItem(activeThreadStorageKey(workspaceId), id);
        } else {
          localStorage.removeItem(activeThreadStorageKey(workspaceId));
        }
      } catch {
        /* ignore */
      }
    },
    [workspaceId],
  );

  useEffect(() => {
    if (!storageReady || isThreadsLoading || isThreadsFetching) return;
    if (!activeThreadId) return;
    const exists = threads.some((t) => t.id === activeThreadId);
    if (!exists) {
      setActiveThreadId(null);
    }
  }, [
    activeThreadId,
    isThreadsFetching,
    isThreadsLoading,
    setActiveThreadId,
    storageReady,
    threads,
  ]);

  const startNewChat = useCallback(() => {
    setActiveThreadId(null);
  }, [setActiveThreadId]);

  const deleteThread = useCallback(
    async (id: string) => {
      await deleteThreadMutation(id);
      if (activeThreadId === id) {
        setActiveThreadId(null);
      }
    },
    [activeThreadId, deleteThreadMutation, setActiveThreadId],
  );

  const shareThread = useCallback(
    async (id: string) => {
      await shareThreadMutation(id);
    },
    [shareThreadMutation],
  );

  const chat = useAiChat({
    noteId,
    threadId: activeThreadId,
    onThreadCreated: setActiveThreadId,
  });

  const savedThreads = useMemo(
    () => threads.filter((t) => t.messageCount > 0),
    [threads],
  );

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeThreadId) ?? null,
    [activeThreadId, threads],
  );

  const value = useMemo<AgentSessionValue>(
    () => ({
      noteId,
      threadId: activeThreadId,
      threads: savedThreads,
      isThreadsLoading,
      isCreatingThread: isCreating,
      isSharing,
      activeThread,
      setActiveThreadId,
      startNewChat,
      deleteThread,
      shareThread,
      messages: chat.messages,
      isStreaming: chat.isStreaming,
      isThreadLoading: chat.isThreadLoading,
      status: chat.status,
      send: chat.send,
      stop: chat.stop,
      addToolOutput: chat.addToolOutput,
      addToolApprovalResponse: chat.addToolApprovalResponse,
    }),
    [
      noteId,
      activeThreadId,
      savedThreads,
      isThreadsLoading,
      isCreating,
      isSharing,
      activeThread,
      setActiveThreadId,
      startNewChat,
      deleteThread,
      shareThread,
      chat.messages,
      chat.isStreaming,
      chat.isThreadLoading,
      chat.status,
      chat.send,
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
