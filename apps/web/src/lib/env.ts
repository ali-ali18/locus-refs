import { z } from "zod";

const envSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1, "Defina ANTHROPIC_API_KEY no .env"),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  NEXT_PUBLIC_COLLAB_WS_URL: z.string().optional(),
  STORAGE_ENDPOINT: z.string().optional(),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  COLLAB_JWT_SECRET: z.string().optional(),
  MINIMAX_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
