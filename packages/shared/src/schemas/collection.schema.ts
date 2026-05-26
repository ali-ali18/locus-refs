import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
  description: z.string().max(200).optional(),
  color: z.string().max(30).optional(),
});

export type CreateCollectionSchema = z.infer<typeof createCollectionSchema>;

export const updateCollectionSchema = createCollectionSchema.partial();
export type UpdateCollectionSchema = z.infer<typeof updateCollectionSchema>;
