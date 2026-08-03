"use client";

import type {
  CreateKanbanCardSchema,
  KanbanBoardDetail,
  KanbanCard,
  UpdateKanbanCardSchema,
} from "@refstash/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWorkspace } from "@/context/workspace";
import { api } from "@/lib/api";
import { kanbanKeys } from "./kanbanKeys";

function upsertCard(
  board: KanbanBoardDetail | undefined,
  card: KanbanCard,
): KanbanBoardDetail | undefined {
  if (!board) return board;
  const exists = board.cards.some((c) => c.id === card.id);
  const cards = exists
    ? board.cards.map((c) => (c.id === card.id ? card : c))
    : [...board.cards, card];
  return {
    ...board,
    cards: cards.sort((a, b) => a.position - b.position),
  };
}

export function useCreateKanbanCard(boardId: string) {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateKanbanCardSchema) => {
      const { data } = await api.post<{ data: KanbanCard }>(
        `/api/kanban/${boardId}/cards`,
        input,
      );
      return data.data;
    },
    onSuccess: (card) => {
      queryClient.setQueryData<KanbanBoardDetail>(
        kanbanKeys.detail(workspaceId, boardId),
        (prev) => upsertCard(prev, card),
      );
      queryClient.invalidateQueries({ queryKey: kanbanKeys.all(workspaceId) });
    },
  });
}

export function useUpdateKanbanCard(boardId: string) {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      cardId,
      ...input
    }: UpdateKanbanCardSchema & { cardId: string }) => {
      const { data } = await api.patch<{ data: KanbanCard }>(
        `/api/kanban/${boardId}/cards/${cardId}`,
        input,
      );
      return data.data;
    },
    onSuccess: (card) => {
      queryClient.setQueryData<KanbanBoardDetail>(
        kanbanKeys.detail(workspaceId, boardId),
        (prev) => upsertCard(prev, card),
      );
    },
  });
}

/** Move/reorder helper — same endpoint as update, clearer call site for DnD. */
export function useMoveKanbanCard(boardId: string) {
  return useUpdateKanbanCard(boardId);
}

export function useDeleteKanbanCard(boardId: string) {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cardId: string) => {
      await api.delete(`/api/kanban/${boardId}/cards/${cardId}`);
      return cardId;
    },
    onSuccess: (cardId) => {
      queryClient.setQueryData<KanbanBoardDetail>(
        kanbanKeys.detail(workspaceId, boardId),
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            cards: prev.cards.filter((c) => c.id !== cardId),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: kanbanKeys.all(workspaceId) });
    },
  });
}
