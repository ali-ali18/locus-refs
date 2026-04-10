"use client";

import { useQuery } from "@tanstack/react-query";
import { useWorkspace } from "@/context/workspace";
import { api } from "@/lib/api";
import type { Note } from "@refstash/shared";
import { noteKeys } from "./noteKeys";

async function getNotes(): Promise<Note[]> {
  const { data } = await api.get<Note[]>("/api/notes");
  return data;
}

async function getNote(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/api/notes/${id}`);
  return data;
}

export function useNotes() {
  const { workspaceId } = useWorkspace();
  return useQuery({
    queryKey: noteKeys.all(workspaceId),
    queryFn: getNotes,
    staleTime: 1000 * 60 * 5,
  });
}

export function useNote(id: string) {
  const { workspaceId } = useWorkspace();
  return useQuery<Note>({
    queryKey: noteKeys.detail(workspaceId, id),
    queryFn: () => getNote(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
