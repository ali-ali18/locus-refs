import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/workspace";
import { api } from "@/lib/api";
import { aiKeys } from "./aiKeys";

interface AiSettings {
  workspaceId: string;
  defaultModelId: string;
  systemPrompt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AiModel {
  id: string;
  provider: string;
  label: string;
  description: string;
}

interface UpdateAiSettingsPayload {
  defaultModelId?: string;
  systemPrompt?: string | null;
}

export function useAiSettings() {
  const { workspaceId } = useWorkspace();

  return useQuery({
    queryKey: aiKeys.settings(workspaceId),
    queryFn: async () => {
      const { data } = await api.get<{ settings: AiSettings }>(
        "/api/ai/settings",
      );
      return data.settings;
    },
  });
}

export function useAiModels() {
  const { workspaceId } = useWorkspace();

  return useQuery({
    queryKey: aiKeys.models(workspaceId),
    queryFn: async () => {
      const { data } = await api.get<{ models: AiModel[] }>("/api/ai/models");
      return data.models;
    },
  });
}

export function useUpdateAiSettings() {
  const queryClient = useQueryClient();
  const { workspaceId } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: UpdateAiSettingsPayload) => {
      const { data } = await api.patch<{ settings: AiSettings }>(
        "/api/ai/settings",
        payload,
      );
      return data.settings;
    },
    onSuccess: (settings) => {
      queryClient.setQueryData(aiKeys.settings(workspaceId), settings);
    },
    onError: () => {
      toast.error("Erro ao salvar configurações de IA. Tente novamente.");
    },
  });
}
