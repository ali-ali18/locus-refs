import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
});

export const categoryDeleteSchema = (slug: string) =>
  z.object({
    confirm: z.string().refine((value) => value === `categoria/${slug}`, {
      message: `Digite exatamente: categoria/${slug}`,
    }),
  });

export type CategorySchema = z.infer<typeof categorySchema>;
export type CategoryDeleteSchema = z.infer<
  ReturnType<typeof categoryDeleteSchema>
>;
