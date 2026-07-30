import { z } from "zod";

export const AI_INTENTS = ["chat", "plan", "suggestion"] as const;
export type AiIntent = (typeof AI_INTENTS)[number];

export const aiIntentSchema = z.object({
  intent: z.enum(AI_INTENTS),
  reason: z.string().optional(),
});

export interface AiMessageMetadata {
  intent?: AiIntent;
  /** Trecho da nota anexado no envio — só para UI do transcript. */
  attachedSelection?: {
    text: string;
    noteId?: string;
  };
}
