import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import type { ModelMetadata, ProviderDefinition } from "./types";

const ATLAS_DEFAULT_BASE_URL = "https://api.atlascloud.ai/v1";

export const atlasConfigSchema = z.object({
  apiKey: z.string().min(1, "ATLASCLOUD_API_KEY é obrigatória"),
  baseURL: z.string().url().optional().default(ATLAS_DEFAULT_BASE_URL),
});

export type AtlasConfig = z.infer<typeof atlasConfigSchema>;

export const ATLAS_CAPABILITIES = {
  toolCalling: true,
  vision: true,
  streaming: true,
  structuredOutput: true,
  jsonMode: true,
  systemPrompt: true,
  parallelToolCalls: true,
} as const;

const TEXT: ModelMetadata["inputModalities"] = ["text"];
const TEXT_IMAGE: ModelMetadata["inputModalities"] = ["text", "image"];

/** Curadoria do Coding Plan (10 modelos). Modalidades conforme docs Atlas / vendor. */
export const ATLAS_STATIC_MODELS: readonly ModelMetadata[] = [
  {
    id: "atlas-deepseek-v4-pro",
    modelId: "deepseek-ai/deepseek-v4-pro",
    label: "DeepSeek V4 Pro",
    description: "Coding / agents, 1M ctx — via Atlas",
    contextWindow: 1_048_576,
    maxOutputTokens: 8_192,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "atlas-deepseek-v4-flash",
    modelId: "deepseek-ai/deepseek-v4-flash",
    label: "DeepSeek V4 Flash",
    description: "Rápido e barato, 1M ctx — via Atlas",
    contextWindow: 1_048_576,
    maxOutputTokens: 8_192,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "atlas-glm-5.2",
    modelId: "zai-org/glm-5.2",
    label: "GLM 5.2",
    description: "Agent / tool use, 1M ctx — via Atlas",
    contextWindow: 1_048_576,
    maxOutputTokens: 8_192,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "atlas-glm-5.1",
    modelId: "zai-org/glm-5.1",
    label: "GLM 5.1",
    description: "Zhipu GLM — via Atlas",
    contextWindow: 202_752,
    maxOutputTokens: 8_192,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "atlas-kimi-k2.7-code",
    modelId: "moonshotai/kimi-k2.7-code",
    label: "Kimi K2.7 Code",
    description: "Coding / debug — via Atlas",
    contextWindow: 262_144,
    maxOutputTokens: 8_192,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "atlas-kimi-k2.6",
    modelId: "moonshotai/kimi-k2.6",
    label: "Kimi K2.6",
    description: "Multimodal (imagem) — via Atlas",
    contextWindow: 262_144,
    maxOutputTokens: 8_192,
    inputModalities: TEXT_IMAGE,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "atlas-kimi-k2.5",
    modelId: "moonshotai/kimi-k2.5",
    label: "Kimi K2.5",
    description: "Long context / multimodal — via Atlas",
    contextWindow: 262_144,
    maxOutputTokens: 8_192,
    inputModalities: TEXT_IMAGE,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "atlas-minimax-m3",
    modelId: "minimaxai/minimax-m3",
    label: "MiniMax M3 (Atlas)",
    description: "Coding / agents, visão — via Atlas",
    contextWindow: 524_300,
    maxOutputTokens: 8_192,
    inputModalities: TEXT_IMAGE,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "atlas-minimax-m2.7",
    modelId: "minimaxai/minimax-m2.7",
    label: "MiniMax M2.7 (Atlas)",
    description: "Coding agent — via Atlas",
    contextWindow: 196_608,
    maxOutputTokens: 8_192,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "atlas-qwen-3.6-plus",
    modelId: "qwen/qwen3.6-plus",
    label: "Qwen 3.6 Plus",
    description: "Chat / produtividade, 1M ctx — via Atlas",
    contextWindow: 1_000_000,
    maxOutputTokens: 8_192,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
  },
];

export const atlasProvider: ProviderDefinition = {
  id: "atlas",
  name: "Atlas Cloud",
  protocol: "openai",
  configSchema: atlasConfigSchema,
  defaultConfig: () => ({
    apiKey: process.env.ATLASCLOUD_API_KEY ?? "",
    baseURL: process.env.ATLASCLOUD_BASE_URL || ATLAS_DEFAULT_BASE_URL,
  }),
  isConfigured: (config) => {
    const parsed = atlasConfigSchema.safeParse(config);
    return parsed.success && parsed.data.apiKey.length > 0;
  },
  buildModel: (modelId, config) => {
    const { apiKey, baseURL } = atlasConfigSchema.parse(config);
    return createOpenAI({ apiKey, baseURL })(modelId);
  },
  capabilities: ATLAS_CAPABILITIES,
  staticModels: ATLAS_STATIC_MODELS,
};
