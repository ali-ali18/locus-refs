import { z } from "zod";

const updateSchema = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  url: z.string().url().optional(),
  iconUrl: z.string().nullable().optional(),
  ogImageUrl: z.string().nullable().optional(),
  collectionId: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
});

type UpdateResourceBody = z.infer<typeof updateSchema>;

export { type UpdateResourceBody, updateSchema };
