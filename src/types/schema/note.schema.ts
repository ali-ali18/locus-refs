import { z } from "zod";

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  icon: z.string().optional(),
  content: z.string().optional(),
  collectionId: z.string().optional(),
});

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;

