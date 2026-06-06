import { anthropic, createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import type { ModelMetadata, ProviderDefinition } from "./types";

export const anthropicConfigSchema = z.object({
  apiKey: z.string().min(1, "ANTHROPIC_API_KEY é obrigatória"),
  baseURL: z.string().url().optional(),
});

export type AnthropicConfig = z.infer<typeof anthropicConfigSchema>;

export const ANTHROPIC_CAPABILITIES = {
  toolCalling: true,
  vision: true,
  streaming: true,
  structuredOutput: true,
  jsonMode: true,
  systemPrompt: true,
  parallelToolCalls: true,
} as const;

export const ANTHROPIC_STATIC_MODELS: readonly ModelMetadata[] = [
  {
    id: "claude-sonnet-4-6",
    label: "Claude Sonnet 4.6",
    description: "Equilíbrio entre velocidade e qualidade — recomendado",
    contextWindow: 200_000,
    maxOutputTokens: 8_192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    supportsTools: true,
  },
  {
    id: "claude-haiku-4-5",
    modelId: "claude-haiku-4-5-20251001",
    label: "Claude Haiku 4.5",
    description: "Mais rápido para tarefas simples",
    contextWindow: 200_000,
    maxOutputTokens: 8_192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    costPer1kInput: 0.0008,
    costPer1kOutput: 0.004,
    supportsTools: true,
  },
];

export const anthropicProvider: ProviderDefinition = {
  id: "anthropic",
  name: "Anthropic",
  configSchema: anthropicConfigSchema,
  defaultConfig: () => ({
    apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
  }),
  isConfigured: (config) => {
    const parsed = anthropicConfigSchema.safeParse(config);
    return parsed.success && parsed.data.apiKey.length > 0;
  },
  buildModel: (modelId, config) => {
    const { apiKey, baseURL } = anthropicConfigSchema.parse(config);
    if (!baseURL) {
      return anthropic(modelId);
    }
    return createAnthropic({ apiKey, baseURL })(modelId);
  },
  capabilities: ANTHROPIC_CAPABILITIES,
  staticModels: ANTHROPIC_STATIC_MODELS,
};
