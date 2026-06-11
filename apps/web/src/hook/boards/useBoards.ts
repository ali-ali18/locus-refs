"use client";

import type {
  Board,
  CreateBoardSchema,
  UpdateBoardSchema,
} from "@refstash/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
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
  return useQuery({
    queryKey: boardKeys.all("__any__"),
    queryFn: getBoards,
    staleTime: 1000 * 60 * 5,
  });
}

export function useBoard(id: string) {
  return useQuery<Board>({
    queryKey: boardKeys.detail("__any__", id),
    queryFn: () => getBoard(id),
    enabled: !!id && id !== "new",
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateBoard() {
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
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

export function useUpdateBoard(id: string) {
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
      queryClient.setQueryData(boardKeys.detail("__any__", id), board);
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/workspace/boards/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}
