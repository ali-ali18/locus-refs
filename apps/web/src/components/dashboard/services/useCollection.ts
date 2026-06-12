import { api } from "@/lib/api";
import type {
  Collection,
  CreateCollectionSchema,
  UpdateCollectionSchema,
} from "@refstash/shared";

export async function getCollections() {
  const { data } = await api.get<Collection[]>("/api/collection");
  return data;
}

export async function createCollection(payload: CreateCollectionSchema) {
  const { data } = await api.post<{ message: string; collection: Collection }>(
    "/api/collection",
    payload,
  );
  return data;
}

export async function deleteCollection(id: string) {
  const { data } = await api.delete<{ message: string }>(
    `/api/collection/${id}`,
  );
  return data;
}

export async function updateCollection(
  id: string,
  payload: UpdateCollectionSchema,
) {
  const { data } = await api.patch<{ message: string; collection: Collection }>(
    `/api/collection/${id}`,
    payload,
  );
  return data;
}
