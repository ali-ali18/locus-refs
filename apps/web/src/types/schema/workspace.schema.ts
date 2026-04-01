import { z } from "zod";

export const workspaceSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do workspace deve ter pelo menos 2 caracteres"),
  slug: z
    .string()
    .min(2, "O slug do workspace deve ter pelo menos 2 caracteres"),
  logo: z.string().optional(),
});

export type Workspace = z.infer<typeof workspaceSchema>;
