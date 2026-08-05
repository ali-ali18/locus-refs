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

/**
 * Curadoria de modelos chat na Groq.
 * Usa createOpenAI().chat() — Groq é OpenAI-compatible (Chat Completions).
 * Compound removido: busca built-in não é o foco e estoura 413 com frequência.
 */
export const GROQ_STATIC_MODELS: readonly ModelMetadata[] = [
  {
    id: "groq-llama-3.3-70b",
    modelId: "llama-3.3-70b-versatile",
    label: "Llama 3.3 70B",
    description: "Qualidade sólida, rápido — via Groq",
    contextWindow: 131_072,
    maxOutputTokens: 32_768,
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
    maxOutputTokens: 131_072,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
  },
  {
    id: "groq-gpt-oss-120b",
    modelId: "openai/gpt-oss-120b",
    label: "GPT OSS 120B",
    description: "OpenAI open-weight flagship + reasoning — via Groq",
    contextWindow: 131_072,
    maxOutputTokens: 65_536,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
    supportsThinking: true,
    thinkingMode: "effort",
  },
  {
    id: "groq-gpt-oss-20b",
    modelId: "openai/gpt-oss-20b",
    label: "GPT OSS 20B",
    description: "Open-weight rápido (~1000 t/s) + reasoning — via Groq",
    contextWindow: 131_072,
    maxOutputTokens: 65_536,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: true,
    supportsThinking: true,
    thinkingMode: "effort",
  },
  {
    id: "groq-qwen-3.6-27b",
    modelId: "qwen/qwen3.6-27b",
    label: "Qwen 3.6 27B",
    description: "Reasoning + visão (preview) — via Groq",
    contextWindow: 131_072,
    maxOutputTokens: 16_384,
    inputModalities: TEXT_IMAGE,
    outputModalities: ["text"],
    supportsTools: true,
    supportsThinking: true,
    thinkingMode: "toggle",
  },
  {
    id: "groq-allam-2-7b",
    modelId: "allam-2-7b",
    label: "ALLaM 2 7B",
    description: "Árabe/inglês bilingue, ~1800 t/s — via Groq",
    contextWindow: 4_096,
    maxOutputTokens: 4_096,
    inputModalities: TEXT,
    outputModalities: ["text"],
    supportsTools: false,
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
    // .chat() força Chat Completions (Groq não usa Responses API).
    return createOpenAI({ apiKey, baseURL }).chat(modelId);
  },
  capabilities: GROQ_CAPABILITIES,
  staticModels: GROQ_STATIC_MODELS,
};
