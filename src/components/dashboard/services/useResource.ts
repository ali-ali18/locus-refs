import { api } from "@/lib/api";
import type { UpdateResourceBody } from "@/types/schema/resources.schema";

export interface ResourceFromApi {
  id: string;
  title: string;
  description: string | null;
  url: string;
  iconUrl: string | null;
  ogImageUrl: string | null;
  collectionId: string;
  categories: { id: string; name: string; slug: string }[];
  fetchedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourcePayload {
  title: string;
  url: string;
  collectionId: string;
  categoryIds: string[];
  description?: string | null;
  iconUrl?: string | null;
  ogImageUrl?: string | null;
}

export async function getResources(collectionId: string | null) {
  const params =
    collectionId != null && collectionId !== ""
      ? { params: { collectionId } }
      : undefined;
  const { data } = await api.get<ResourceFromApi[]>("/api/resources", params);
  return data;
}

export async function createResource(payload: CreateResourcePayload) {
  const { data } = await api.post<{ message: string; resource: ResourceFromApi }>(
    "/api/resources",
    payload,
  );
  return data;
}

export async function deleteResource(id: string) {
  const { data } = await api.delete<{ message: string }>(
    `/api/resources/${id}`,
  );
  return data;
}

export async function updateResource(id: string, body: UpdateResourceBody) {
  const { data } = await api.patch<ResourceFromApi>(
    `/api/resources/${id}`,
    body,
  );
  return data;
}