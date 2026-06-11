import { z } from "zod";

/**
 * Schema do Board. Sem `createdById`/`createdAt` no input — o backend preenche.
 */
export const createBoardSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(1000).optional(),
  icon: z.string().max(60).optional(),
});

export type CreateBoardSchema = z.infer<typeof createBoardSchema>;

export const updateBoardSchema = z
  .object({
    title: z.string().min(1).max(120).optional(),
    description: z.string().max(1000).nullable().optional(),
    icon: z.string().max(60).nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateBoardSchema = z.infer<typeof updateBoardSchema>;
