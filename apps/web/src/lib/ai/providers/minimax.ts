import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { ANTHROPIC_CAPABILITIES } from "./anthropic";
import type { ModelMetadata, ProviderDefinition } from "./types";

const MINIMAX_DEFAULT_BASE_URL = "https://api.minimax.io/anthropic/v1";

export const minimaxConfigSchema = z.object({
  apiKey: z.string().min(1, "MINIMAX_API_KEY é obrigatória"),
  baseURL: z.string().url().optional().default(MINIMAX_DEFAULT_BASE_URL),
});

export type MinimaxConfig = z.infer<typeof minimaxConfigSchema>;

export const MINIMAX_STATIC_MODELS: readonly ModelMetadata[] = [
  {
    id: "minimax-m2.7",
    modelId: "MiniMax-M2.7",
    label: "MiniMax M2.7",
    description: "Modelo mais recente da MinMax — lançado março 2026",
    contextWindow: 200_000,
    maxOutputTokens: 8_192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "minimax-m3",
    modelId: "MiniMax-M3",
    label: "MiniMax M3",
    description: "Modelo mais recente da MinMax — lançado junho 2026",
    contextWindow: 200_000,
    maxOutputTokens: 8_192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    supportsTools: true,
    supportsThinking: true,
    thinkingMode: "adaptive",
  },
];

export const minimaxProvider: ProviderDefinition = {
  id: "minimax",
  name: "MiniMax",
  configSchema: minimaxConfigSchema,
  defaultConfig: () => ({
    apiKey: process.env.MINIMAX_API_KEY ?? "",
    baseURL: process.env.MINIMAX_BASE_URL || MINIMAX_DEFAULT_BASE_URL,
  }),
  isConfigured: (config) => {
    const parsed = minimaxConfigSchema.safeParse(config);
    return parsed.success && parsed.data.apiKey.length > 0;
  },
  buildModel: (modelId, config) => {
    const { apiKey, baseURL } = minimaxConfigSchema.parse(config);
    return createAnthropic({ apiKey, baseURL })(modelId);
  },
  capabilities: ANTHROPIC_CAPABILITIES,
  staticModels: MINIMAX_STATIC_MODELS,
};
