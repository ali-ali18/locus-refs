import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
});

export type CreateCollectionSchema = z.infer<typeof createCollectionSchema>;
