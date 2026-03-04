"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type CreateResourceStep2Schema,
  createResourceStep2Schema,
} from "@/types/resource.schema";
import type { ResourceFromApi } from "../services/useResource";
import { useResourceMutations } from "./useResourceMutations";

interface UseEditResourceDialogProps {
  open: boolean;
  resource: ResourceFromApi | null;
  onOpenChange: (open: boolean) => void;
}

const EMPTY_VALUES: CreateResourceStep2Schema = {
  title: "",
  description: "",
  url: "",
  collectionId: "",
  categoryIds: [],
};

export function useEditResourceDialog({
  open,
  resource,
  onOpenChange,
}: UseEditResourceDialogProps) {
  const { updateResource, isUpdatingResource } = useResourceMutations();

  const form = useForm<CreateResourceStep2Schema>({
    resolver: zodResolver(createResourceStep2Schema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open && resource) {
      form.reset({
        categoryIds: resource.categories.map((category) => category.id),
        collectionId: resource.collectionId ?? "",
        description: resource.description ?? "",
        title: resource.title ?? "",
        url: resource.url ?? "",
      });
    }
    if (!open) {
      form.reset(EMPTY_VALUES);
    }
  }, [open, resource, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!resource) return;

    try {
      await updateResource({
        id: resource.id,
        body: {
          title: data.title,
          description: data.description || null,
          url: data.url,
          collectionId: data.collectionId,
          categoryIds: data.categoryIds,
        },
      });
      toast.success("Recurso atualizado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao atualizar recurso. Tente novamente.");
      console.error(error);
    }
  });

  return {
    form,
    handleSubmit,
    isUpdatingResource,
  };
}
