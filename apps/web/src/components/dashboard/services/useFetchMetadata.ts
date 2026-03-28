import { api } from "@/lib/api";

export interface Metadata {
  title: string | null;
  description: string | null;
  ogImageUrl: string | null;
  iconUrl: string | null;
}

export async function fetchMetadata(url: string) {
  const { data } = await api.post<Metadata>("/api/fetchMetadata", { url });
  return data;
}
