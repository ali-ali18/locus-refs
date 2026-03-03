import { api } from "@/lib/api";
import type { Collection } from "@/types/collection.type";

export async function getCollections() {
  const { data } = await api.get<Collection[]>("/api/collection");
  return data;
}

export async function createCollection(name: string) {
  const { data } = await api.post<{ message: string; collection: Collection }>(
    "/api/collection",
    { name },
  );
  return data;
}

export async function deleteCollection(id: string) {
  const { data } = await api.delete<{ message: string }>(
    `/api/collection/${id}`,
  );
  return data;
}

export async function updateCollection(id: string, name: string) {
  const { data } = await api.patch<{ message: string; collection: Collection }>(
    `/api/collection/${id}`,
    { name },
  );
  return data;
}
