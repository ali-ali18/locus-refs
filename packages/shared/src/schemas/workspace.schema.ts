import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, "O nome é obrigatório")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
  slug: z
    .string()
    .min(2, "O slug é obrigatório")
    .max(50, "O slug deve ter no máximo 50 caracteres")
    .regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e hífens"),
  logo: z.string().optional(),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = createWorkspaceSchema.partial();

export type UpdateWorkspaceSchema = z.infer<typeof updateWorkspaceSchema>;

export const inviteMemberSchema = z.object({
  email: z.email("Email inválido"),
  role: z.enum(["admin", "member"]),
});

export type InviteMemberSchema = z.infer<typeof inviteMemberSchema>;
