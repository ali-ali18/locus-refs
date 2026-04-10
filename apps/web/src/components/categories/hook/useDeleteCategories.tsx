"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCategory } from "@/hook/categories/useCategory";
import type { Category } from "@refstash/shared";
import {
  type CategoryDeleteSchema,
  categoryDeleteSchema,
} from "@refstash/shared";

interface UseDeleteCategoriesProps {
  onSuccess: () => void;
  category: Category;
}

export function useDeleteCategories({
  onSuccess,
  category,
}: UseDeleteCategoriesProps) {
  const { deleteCategory, isLoading } = useCategory();

  const form = useForm<CategoryDeleteSchema>({
    resolver: zodResolver(categoryDeleteSchema(`${category.slug}`)),
    defaultValues: {
      confirm: "",
    },
  });

  const onSubmit = async () => {
    try {
      await deleteCategory(category.id);
      toast.success("Categoria excluída com sucesso!");
      onSuccess();
    } catch (_error) {
      toast.error("Erro ao excluir categoria. Tente novamente.");
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
}
