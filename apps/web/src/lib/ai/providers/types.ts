import type { LanguageModel } from "ai";
import type { z } from "zod";

export interface ProviderCapabilities {
  toolCalling: boolean;
  vision: boolean;
  streaming: boolean;
  structuredOutput: boolean;
  jsonMode: boolean;
  systemPrompt: boolean;
  parallelToolCalls: boolean;
}

export type Modality = "text" | "image" | "audio" | "pdf";

export interface ModelMetadata {
  id: string;
  modelId?: string;
  label: string;
  description?: string;
  contextWindow: number;
  maxOutputTokens: number;
  inputModalities: Modality[];
  outputModalities: Modality[];
  costPer1kInput?: number;
  costPer1kOutput?: number;
  supportsTools?: boolean;
  /** Modelo expõe raciocínio (thinking) configurável. */
  supportsThinking?: boolean;
  /** Como habilitar thinking na API Anthropic-compatible. */
  thinkingMode?: "adaptive" | "budget";
  deprecated?: boolean;
}

export type ProviderConfigSchema = z.ZodTypeAny;

export interface ProviderDefinition {
  id: string;
  name: string;
  icon?: string;
  configSchema: ProviderConfigSchema;
  defaultConfig: () => Record<string, unknown>;
  isConfigured: (config: Record<string, unknown>) => boolean;
  buildModel: (
    modelId: string,
    config: Record<string, unknown>,
  ) => LanguageModel;
  listModels?: (config: Record<string, unknown>) => Promise<ModelMetadata[]>;
  capabilities: ProviderCapabilities;
  staticModels?: readonly ModelMetadata[];
}
