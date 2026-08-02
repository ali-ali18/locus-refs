"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/workspace";
import { api } from "@/lib/api";
import type { AgentSkill } from "@/types/agent-skill.type";
import type {
  CreateSkillSchema,
  UpdateSkillSchema,
} from "@/types/schema/skill.schema";
import { agentSkillKeys } from "./agentSkillKeys";

export function useAgentSkills() {
  const { workspaceId } = useWorkspace();

  return useQuery({
    queryKey: agentSkillKeys.all(workspaceId),
    queryFn: async () => {
      const { data } = await api.get<{ data: AgentSkill[] }>("/api/ai/skills");
      return data.data;
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 30,
  });
}

export function useAgentSkillMutations() {
  const queryClient = useQueryClient();
  const { workspaceId } = useWorkspace();

  const invalidate = () => {
    void queryClient.invalidateQueries({
      queryKey: agentSkillKeys.all(workspaceId),
    });
  };

  const createSkill = useMutation({
    mutationFn: async (input: CreateSkillSchema) => {
      const { data } = await api.post<{ data: AgentSkill }>(
        "/api/ai/skills",
        input,
      );
      return data.data;
    },
    onSuccess: (skill) => {
      queryClient.setQueryData<AgentSkill[]>(
        agentSkillKeys.all(workspaceId),
        (prev) => {
          if (!prev) return [skill];
          if (prev.some((s) => s.id === skill.id)) return prev;
          return [skill, ...prev];
        },
      );
      invalidate();
      toast.success("Skill criada.");
    },
    onError: () => toast.error("Não foi possível criar a skill."),
  });

  const updateSkill = useMutation({
    mutationFn: async (input: { id: string } & UpdateSkillSchema) => {
      const { id, ...payload } = input;
      const { data } = await api.patch<{ data: AgentSkill }>(
        `/api/ai/skills/${id}`,
        payload,
      );
      return data.data;
    },
    onSuccess: (skill) => {
      queryClient.setQueryData<AgentSkill[]>(
        agentSkillKeys.all(workspaceId),
        (prev) =>
          prev?.map((s) => (s.id === skill.id ? { ...s, ...skill } : s)) ??
          prev,
      );
      invalidate();
      toast.success("Skill atualizada.");
    },
    onError: () => toast.error("Não foi possível atualizar a skill."),
  });

  const deleteSkill = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/ai/skills/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<AgentSkill[]>(
        agentSkillKeys.all(workspaceId),
        (prev) => prev?.filter((s) => s.id !== id) ?? prev,
      );
      invalidate();
      toast.success("Skill excluída.");
    },
    onError: () => toast.error("Não foi possível excluir a skill."),
  });

  return {
    createSkill: createSkill.mutateAsync,
    updateSkill: updateSkill.mutateAsync,
    deleteSkill: deleteSkill.mutateAsync,
    isCreating: createSkill.isPending,
    isUpdating: updateSkill.isPending,
    isDeleting: deleteSkill.isPending,
  };
}
