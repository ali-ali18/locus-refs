import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import type { ModelMetadata, ProviderDefinition } from "./types";

const GROQ_DEFAULT_BASE_URL = "https://api.groq.com/openai/v1";

export const groqConfigSchema = z.object({
  apiKey: z.string().min(1, "GROQ_API_KEY é obrigatória"),
  baseURL: z.string().url().optional().default(GROQ_DEFAULT_BASE_URL),
});

export type GroqConfig = z.infer<typeof groqConfigSchema>;

export const GROQ_CAPABILITIES = {
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

/** Curadoria de modelos chat de produção / preview útil na Groq. */
export const GROQ_STATIC_MODELS: readonly ModelMetadata[] = [
  {
    id: "groq-llama-3.3-70b",
    modelId: "llama-3.3-70b-versatile",
    label: "Llama 3.3 70B",
    description: "Qualidade sólida, rápido — via Groq",
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "groq-llama-3.1-8b",
    modelId: "llama-3.1-8b-instant",
    label: "Llama 3.1 8B Instant",
    description: "Ultra-rápido / barato — via Groq",
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "groq-gpt-oss-120b",
    modelId: "openai/gpt-oss-120b",
    label: "GPT OSS 120B",
    description: "OpenAI open-weight flagship — via Groq",
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "groq-gpt-oss-20b",
    modelId: "openai/gpt-oss-20b",
    label: "GPT OSS 20B",
    description: "Open-weight rápido (~1000 t/s) — via Groq",
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "groq-qwen-3.6-27b",
    modelId: "qwen/qwen3.6-27b",
    label: "Qwen 3.6 27B",
    description: "Reasoning + visão (preview) — via Groq",
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    inputModalities: TEXT_IMAGE,
    outputModalities: ["text"],
    supportsTools: true,
  },
];

export const groqProvider: ProviderDefinition = {
  id: "groq",
  name: "Groq",
  protocol: "openai",
  configSchema: groqConfigSchema,
  defaultConfig: () => ({
    apiKey: process.env.GROQ_API_KEY ?? "",
    baseURL: process.env.GROQ_BASE_URL || GROQ_DEFAULT_BASE_URL,
  }),
  isConfigured: (config) => {
    const parsed = groqConfigSchema.safeParse(config);
    return parsed.success && parsed.data.apiKey.length > 0;
  },
  buildModel: (modelId, config) => {
    const { apiKey, baseURL } = groqConfigSchema.parse(config);
    return createOpenAI({ apiKey, baseURL })(modelId);
  },
  capabilities: GROQ_CAPABILITIES,
  staticModels: GROQ_STATIC_MODELS,
};
