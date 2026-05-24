import { z } from "zod";

export const noteContentSchema = z.record(z.string(), z.unknown());

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  icon: z.string().optional(),
  collectionId: z.string().optional(),
});

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;

export const updateHeaderNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  icon: z.string().optional(),
});

export type UpdateHeaderNoteSchema = z.infer<typeof updateHeaderNoteSchema>;
