"use client";

import type {
  CreateKanbanBoardSchema,
  KanbanBoard,
  KanbanBoardDetail,
  KanbanUserSummary,
  UpdateKanbanBoardSchema,
} from "@refstash/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useWorkspace } from "@/context/workspace";
import { api } from "@/lib/api";
import { kanbanKeys } from "./kanbanKeys";

export type KanbanBoardListItem = KanbanBoard & {
  createdBy: KanbanUserSummary;
  _count: { cards: number; columns: number };
};

async function getKanbanBoards(): Promise<KanbanBoardListItem[]> {
  const { data } = await api.get<KanbanBoardListItem[]>("/api/kanban");
  return data;
}

async function getKanbanBoard(id: string): Promise<KanbanBoardDetail> {
  const { data } = await api.get<KanbanBoardDetail>(`/api/kanban/${id}`);
  return data;
}

export function useKanbanBoards() {
  const { workspaceId } = useWorkspace();
  return useQuery({
    queryKey: kanbanKeys.all(workspaceId),
    queryFn: getKanbanBoards,
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useKanbanBoard(id: string) {
  const { workspaceId } = useWorkspace();
  return useQuery({
    queryKey: kanbanKeys.detail(workspaceId, id),
    queryFn: () => getKanbanBoard(id),
    enabled: !!workspaceId && !!id && id !== "new",
    staleTime: 1000 * 30,
  });
}

export function useCreateKanbanBoard() {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateKanbanBoardSchema) => {
      const { data } = await api.post<{ data: KanbanBoardDetail }>(
        "/api/kanban",
        input,
      );
      return data.data;
    },
    onSuccess: (board) => {
      queryClient.setQueryData(
        kanbanKeys.detail(workspaceId, board.id),
        board,
      );
      queryClient.invalidateQueries({ queryKey: kanbanKeys.all(workspaceId) });
    },
  });
}

export function useUpdateKanbanBoard(id: string) {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateKanbanBoardSchema) => {
      const { data } = await api.patch<{ data: KanbanBoardDetail }>(
        `/api/kanban/${id}`,
        input,
      );
      return data.data;
    },
    onSuccess: (board) => {
      queryClient.setQueryData(kanbanKeys.detail(workspaceId, id), board);
      queryClient.invalidateQueries({ queryKey: kanbanKeys.all(workspaceId) });
    },
  });
}

export function useDeleteKanbanBoard() {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/kanban/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({
        queryKey: kanbanKeys.detail(workspaceId, id),
      });
      queryClient.invalidateQueries({ queryKey: kanbanKeys.all(workspaceId) });
    },
  });
}
