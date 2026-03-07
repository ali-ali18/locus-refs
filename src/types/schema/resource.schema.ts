import { z } from "zod";

export const createResourceSchema = z.object({
  url: z
    .url("Insira uma URL válida")
    .min(1, "URL é obrigatória")
    .max(2048, "URL deve ter no máximo 2048 caracteres"),
});

export type CreateResourceSchema = z.infer<typeof createResourceSchema>;

export const createResourceStep2Schema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  url: z.string().min(1),
  collectionId: z.string().min(1, "Selecione uma coleção"),
  categoryIds: z.array(z.string()).min(1, "Selecione ao menos uma categoria"),
});

export type CreateResourceStep2Schema = z.infer<typeof createResourceStep2Schema>;
