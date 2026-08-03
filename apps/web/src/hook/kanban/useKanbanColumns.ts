"use client";

import type {
  CreateKanbanColumnSchema,
  KanbanBoardDetail,
  KanbanColumn,
  UpdateKanbanColumnSchema,
} from "@refstash/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWorkspace } from "@/context/workspace";
import { api } from "@/lib/api";
import { kanbanKeys } from "./kanbanKeys";

function patchBoardColumns(
  board: KanbanBoardDetail | undefined,
  updater: (columns: KanbanColumn[]) => KanbanColumn[],
): KanbanBoardDetail | undefined {
  if (!board) return board;
  return { ...board, columns: updater(board.columns) };
}

export function useCreateKanbanColumn(boardId: string) {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateKanbanColumnSchema) => {
      const { data } = await api.post<{ data: KanbanColumn }>(
        `/api/kanban/${boardId}/columns`,
        input,
      );
      return data.data;
    },
    onSuccess: (column) => {
      queryClient.setQueryData<KanbanBoardDetail>(
        kanbanKeys.detail(workspaceId, boardId),
        (prev) =>
          patchBoardColumns(prev, (columns) =>
            [...columns, column].sort((a, b) => a.position - b.position),
          ),
      );
      queryClient.invalidateQueries({ queryKey: kanbanKeys.all(workspaceId) });
    },
  });
}

export function useUpdateKanbanColumn(boardId: string) {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      columnId,
      ...input
    }: UpdateKanbanColumnSchema & { columnId: string }) => {
      const { data } = await api.patch<{ data: KanbanColumn }>(
        `/api/kanban/${boardId}/columns/${columnId}`,
        input,
      );
      return data.data;
    },
    onSuccess: (column) => {
      queryClient.setQueryData<KanbanBoardDetail>(
        kanbanKeys.detail(workspaceId, boardId),
        (prev) =>
          patchBoardColumns(prev, (columns) =>
            columns
              .map((c) => (c.id === column.id ? column : c))
              .sort((a, b) => a.position - b.position),
          ),
      );
    },
  });
}

export function useDeleteKanbanColumn(boardId: string) {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (columnId: string) => {
      await api.delete(`/api/kanban/${boardId}/columns/${columnId}`);
      return columnId;
    },
    onSuccess: (columnId) => {
      queryClient.setQueryData<KanbanBoardDetail>(
        kanbanKeys.detail(workspaceId, boardId),
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            columns: prev.columns.filter((c) => c.id !== columnId),
            cards: prev.cards.filter((c) => c.columnId !== columnId),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: kanbanKeys.all(workspaceId) });
    },
  });
}
