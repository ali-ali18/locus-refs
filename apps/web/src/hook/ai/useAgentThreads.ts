"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/workspace";
import type { AgentThreadSummary } from "@/types/agent-thread.type";
import type { AiUIMessage } from "@/components/chat/hook/useAiChat";
import { api } from "@/lib/api";
import { agentThreadKeys } from "./agentThreadKeys";

export function useAgentThreads() {
  const { workspaceId } = useWorkspace();
  return useQuery({
    queryKey: agentThreadKeys.all(workspaceId),
    queryFn: async () => {
      const { data } = await api.get<{ data: AgentThreadSummary[] }>(
        "/api/ai/chat/threads",
      );
      return data.data;
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 30,
  });
}

export function useAgentThread(threadId: string | null) {
  const { workspaceId } = useWorkspace();
  return useQuery({
    queryKey: agentThreadKeys.detail(workspaceId, threadId ?? ""),
    queryFn: async () => {
      const { data } = await api.get<{
        data: AgentThreadSummary & { messages: AiUIMessage[] };
      }>(`/api/ai/chat/threads/${threadId}`);
      return data.data;
    },
    enabled: !!workspaceId && !!threadId,
    staleTime: 1000 * 15,
  });
}

export function useAgentThreadMutations() {
  const queryClient = useQueryClient();
  const { workspaceId } = useWorkspace();

  const invalidate = () => {
    void queryClient.invalidateQueries({
      queryKey: agentThreadKeys.all(workspaceId),
    });
  };

  const createThread = useMutation({
    mutationFn: async (input: {
      visibility: "private" | "workspace";
      title?: string;
    }) => {
      const { data } = await api.post<{ data: AgentThreadSummary }>(
        "/api/ai/chat/threads",
        input,
      );
      return data.data;
    },
    onSuccess: (thread) => {
      queryClient.setQueryData<AgentThreadSummary[]>(
        agentThreadKeys.all(workspaceId),
        (prev) => {
          if (!prev) return [thread];
          if (prev.some((t) => t.id === thread.id)) return prev;
          return [thread, ...prev];
        },
      );
      invalidate();
    },
    onError: () => toast.error("Não foi possível criar a conversa."),
  });

  const saveThread = useMutation({
    mutationFn: async (input: {
      threadId: string;
      messages: AiUIMessage[];
      title?: string | null;
    }) => {
      const { data } = await api.put<{ data: AgentThreadSummary }>(
        `/api/ai/chat/threads/${input.threadId}`,
        { messages: input.messages, title: input.title },
      );
      return data.data;
    },
    onSuccess: (thread, vars) => {
      queryClient.setQueryData<AgentThreadSummary[]>(
        agentThreadKeys.all(workspaceId),
        (prev) =>
          prev?.map((t) => (t.id === thread.id ? { ...t, ...thread } : t)) ??
          prev,
      );
      invalidate();
      void queryClient.invalidateQueries({
        queryKey: agentThreadKeys.detail(workspaceId, vars.threadId),
      });
    },
  });

  const deleteThread = useMutation({
    mutationFn: async (threadId: string) => {
      await api.delete(`/api/ai/chat/threads/${threadId}`);
      return threadId;
    },
    onSuccess: (threadId) => {
      queryClient.setQueryData<AgentThreadSummary[]>(
        agentThreadKeys.all(workspaceId),
        (prev) => prev?.filter((t) => t.id !== threadId) ?? prev,
      );
      invalidate();
      queryClient.removeQueries({
        queryKey: agentThreadKeys.detail(workspaceId, threadId),
      });
    },
    onError: () => toast.error("Não foi possível excluir a conversa."),
  });

  const shareThread = useMutation({
    mutationFn: async (threadId: string) => {
      const { data } = await api.patch<{ data: AgentThreadSummary }>(
        `/api/ai/chat/threads/${threadId}`,
        { visibility: "workspace" },
      );
      return data.data;
    },
    onSuccess: (thread) => {
      queryClient.setQueryData<AgentThreadSummary[]>(
        agentThreadKeys.all(workspaceId),
        (prev) =>
          prev?.map((t) => (t.id === thread.id ? { ...t, ...thread } : t)) ??
          prev,
      );
      invalidate();
      void queryClient.invalidateQueries({
        queryKey: agentThreadKeys.detail(workspaceId, thread.id),
      });
      toast.success("Conversa compartilhada com o workspace.");
    },
    onError: () => toast.error("Não foi possível compartilhar a conversa."),
  });

  return {
    createThread: createThread.mutateAsync,
    saveThread: saveThread.mutateAsync,
    deleteThread: deleteThread.mutateAsync,
    shareThread: shareThread.mutateAsync,
    isCreating: createThread.isPending,
    isDeleting: deleteThread.isPending,
    isSharing: shareThread.isPending,
  };
}
