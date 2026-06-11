"use client";

import type {
  Board,
  CreateBoardSchema,
  UpdateBoardSchema,
} from "@refstash/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useWorkspace } from "@/context/workspace";
import { boardKeys } from "./boardKeys";

async function getBoards(): Promise<Board[]> {
  const { data } = await api.get<Board[]>("/api/workspace/boards");
  return data;
}

async function getBoard(id: string): Promise<Board> {
  const { data } = await api.get<Board>(`/api/workspace/boards/${id}`);
  return data;
}

export function useBoards() {
  const { workspaceId } = useWorkspace();
  return useQuery({
    queryKey: boardKeys.all(workspaceId),
    queryFn: getBoards,
    staleTime: 1000 * 60 * 5,
  });
}

export function useBoard(id: string) {
  const { workspaceId } = useWorkspace();
  return useQuery<Board>({
    queryKey: boardKeys.detail(workspaceId, id),
    queryFn: () => getBoard(id),
    enabled: !!id && id !== "new",
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateBoard() {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBoardSchema) => {
      const { data } = await api.post<{ data: Board }>(
        "/api/workspace/boards",
        input,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all(workspaceId) });
    },
  });
}

export function useUpdateBoard(id: string) {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateBoardSchema) => {
      const { data } = await api.patch<{ data: Board }>(
        `/api/workspace/boards/${id}`,
        input,
      );
      return data.data;
    },
    onSuccess: (board) => {
      queryClient.setQueryData(boardKeys.detail(workspaceId, id), board);
      queryClient.invalidateQueries({ queryKey: boardKeys.all(workspaceId) });
    },
  });
}

export function useDeleteBoard() {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/workspace/boards/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all(workspaceId) });
    },
  });
}
