import { api } from "@/lib/api";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export async function getCategories() {
  const { data } = await api.get<Category[]>("/api/categories");
  return data;
}

export async function createCategory(name: string) {
  const { data } = await api.post<{ message: string; category: Category }>(
    "/api/categories",
    { name },
  );
  return data;
}
