"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCategory } from "@/hook/categories/useCategory";
import type { Category } from "@refstash/shared";
import { type CategorySchema, categorySchema } from "@refstash/shared";

interface UseCategoryFormOptions {
  onSuccess?: () => void;
  category?: Category | null;
}

export function useCategoryForm(options?: UseCategoryFormOptions) {
  const { createCategory, updateCategory, isLoading } = useCategory();

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: options?.category?.name ?? "",
    },
  });

  useEffect(() => {
    if (options?.category) {
      form.reset({
        name: options.category.name,
      });
    }
  }, [options?.category?.id]);

  const onSubmit = async (data: CategorySchema) => {
    try {
      if (options?.category) {
        await updateCategory({ id: options.category.id, name: data.name });
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await createCategory(data.name);
      }
      form.reset();
      options?.onSuccess?.();
    } catch (_error) {
      toast.error("Erro ao salvar categoria. Tente novamente.");
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
}
