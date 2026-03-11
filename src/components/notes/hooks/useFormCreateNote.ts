"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNoteMutations } from "@/hook/notes/useNote";
import {
  type CreateNoteSchema,
  createNoteSchema,
} from "@/types/schema/note.schema";

interface UseFormCreateNoteReturn {
  form: UseFormReturn<CreateNoteSchema>;
  onSubmit: (data: CreateNoteSchema) => Promise<void>;
  isLoading: boolean;
}

export function useFormCreateNote(): UseFormCreateNoteReturn {
  const { createNote, isLoading } = useNoteMutations();

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      icon: "",
      title: "",
      content: "",
      collectionId: undefined,
    },
  });

  const onSubmit = async (data: CreateNoteSchema) => {
    try {
      await createNote({
        title: data.title,
        icon: data.icon || undefined,
        collectionId: data.collectionId || undefined,
      });
      toast.success("Nota criada com sucesso!");
      form.reset({
        title: "",
        icon: "",
        content: "",
        collectionId: undefined,
      });
    } catch (_error) {
      toast.error("Erro ao criar nota. Tente novamente.");
    }
  };

  return { form, onSubmit, isLoading };
}
