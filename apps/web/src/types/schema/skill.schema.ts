import { z } from "zod";

const createSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().max(500).nullable().optional(),
  prompt: z.string().trim().min(1).max(10000),
  requiresNote: z.boolean().optional().default(false),
  visibility: z.enum(["personal", "workspace"]).optional().default("personal"),
});

const updateSchema = z
  .object({
    title: z.string().trim().min(1).max(150).optional(),
    description: z.string().trim().max(500).nullable().optional(),
    prompt: z.string().trim().min(1).max(10000).optional(),
    requiresNote: z.boolean().optional(),
    visibility: z.enum(["personal", "workspace"]).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "Empty update object" });

/** Payload enviado ao criar (defaults aplicados no parse da API). */
type CreateSkillSchema = z.input<typeof createSchema>;
type UpdateSkillSchema = z.input<typeof updateSchema>;

export {
  createSchema,
  updateSchema,
  type CreateSkillSchema,
  type UpdateSkillSchema,
};
