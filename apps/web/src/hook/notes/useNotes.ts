"use client";

import { useQuery } from "@tanstack/react-query";
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
  return useQuery({
    queryKey: noteKeys.all,
    queryFn: getNotes,
    staleTime: 1000 * 60 * 5,
  });
}

export function useNote(id: string) {
  return useQuery<Note>({
    queryKey: noteKeys.detail(id),
    queryFn: () => getNote(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
