import { api } from "@/lib/api";
import type { Category } from "@/types/categories.type";

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

export async function updateCategory(id: string, name: string) {
  const { data } = await api.patch<{ message: string; category: Category }>(
    `/api/categories/${id}`,
    { name },
  );
  return data;
}

export async function deleteCategory(id: string) {
  const { data } = await api.delete<{ message: string }>(
    `/api/categories/${id}`,
  );
  return data;
}
