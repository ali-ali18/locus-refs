"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type CreateResourceSchema,
  type CreateResourceStep2Schema,
  createResourceSchema,
  createResourceStep2Schema,
} from "@/types/resource.schema";
import type { Category } from "../services/useCategory";
import type { Metadata } from "../services/useFetchMetadata";
import type { CreateResourcePayload } from "../services/useResource";

interface UseCreateResourceDialogProps {
  open: boolean;
  defaultCollectionId: string | null;
  metadata: Metadata | null;
  onOpenChange: (open: boolean) => void;
  onFetchMetadataRequest: (url: string) => void;
  onCreateCategory: (
    name: string,
  ) => Promise<{ message: string; category: Category }>;
  onCreateResource: (payload: CreateResourcePayload) => Promise<unknown>;
}

export function useCreateResourceDialog({
  open,
  defaultCollectionId,
  metadata,
  onOpenChange,
  onFetchMetadataRequest,
  onCreateCategory,
  onCreateResource,
}: UseCreateResourceDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] =
    useState(false);
  const userClickedBackRef = useRef(false);

  const formStep1 = useForm<CreateResourceSchema>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: { url: "" },
  });

  const formStep2 = useForm<CreateResourceStep2Schema>({
    resolver: zodResolver(createResourceStep2Schema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
      collectionId: defaultCollectionId ?? "",
      categoryIds: [],
    },
  });

  useEffect(() => {
    if (metadata && step === 1 && !userClickedBackRef.current) {
      formStep2.reset({
        title: metadata.title ?? "",
        description: metadata.description ?? "",
        url: formStep1.getValues("url"),
        collectionId: defaultCollectionId ?? "",
        categoryIds: [],
      });
      setStep(2);
    }
  }, [metadata, defaultCollectionId, step, formStep1, formStep2]);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setIsCreateCategoryDialogOpen(false);
      setNewCategoryName("");
      formStep1.reset({ url: "" });
      formStep2.reset({
        title: "",
        description: "",
        url: "",
        collectionId: defaultCollectionId ?? "",
        categoryIds: [],
      });
    }
  }, [open, defaultCollectionId, formStep1, formStep2]);

  useEffect(() => {
    formStep2.setValue("collectionId", defaultCollectionId ?? "");
  }, [defaultCollectionId, formStep2]);

  const onStep1Submit = (data: CreateResourceSchema) => {
    userClickedBackRef.current = false;
    onFetchMetadataRequest(data.url);
    if (metadata) {
      formStep2.reset({
        title: metadata.title ?? "",
        description: metadata.description ?? "",
        url: data.url,
        collectionId: defaultCollectionId ?? "",
        categoryIds: [],
      });
      setStep(2);
    }
  };

  const onStep2Submit = async (data: CreateResourceStep2Schema) => {
    try {
      await onCreateResource({
        title: data.title,
        url: data.url,
        collectionId: data.collectionId,
        categoryIds: data.categoryIds,
        description: data.description || null,
        iconUrl: metadata?.iconUrl ?? null,
        ogImageUrl: metadata?.ogImageUrl ?? null,
      });
      toast.success("Recurso criado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao criar recurso. Tente novamente.");
      console.error(error);
    }
  };

  const handleBack = () => {
    userClickedBackRef.current = true;
    setStep(1);
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    try {
      const { category } = await onCreateCategory(name);
      formStep2.setValue("categoryIds", [category.id], {
        shouldValidate: true,
      });
      setNewCategoryName("");
      setIsCreateCategoryDialogOpen(false);
      toast.success("Categoria criada!");
    } catch {
      toast.error("Erro ao criar categoria.");
    }
  };

  return {
    step,
    formStep1,
    formStep2,
    newCategoryName,
    setNewCategoryName,
    isCreateCategoryDialogOpen,
    setIsCreateCategoryDialogOpen,
    onStep1Submit,
    onStep2Submit,
    handleBack,
    handleCreateCategory,
  };
}
