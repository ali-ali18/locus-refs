import type { LanguageModel } from "ai";
import { anthropicProvider } from "./anthropic";
import { minimaxProvider } from "./minimax";
import type { ModelMetadata, ProviderDefinition } from "./types";

export const providerRegistry: readonly ProviderDefinition[] = [
  anthropicProvider,
  minimaxProvider,
];

export function getProvider(id: string): ProviderDefinition {
  const provider = providerRegistry.find((p) => p.id === id);
  if (!provider) {
    throw new Error(
      `Provider "${id}" não registrado. Registrados: ${providerRegistry
        .map((p) => p.id)
        .join(", ")}.`,
    );
  }
  return provider;
}

export function listProviders(): readonly ProviderDefinition[] {
  return providerRegistry;
}

export interface ResolveModelOptions {
  providerId: string;
  modelId: string;
  config?: Record<string, unknown>;
}

export function resolveModel(opts: ResolveModelOptions): {
  model: LanguageModel;
  metadata?: ModelMetadata;
} {
  const provider = getProvider(opts.providerId);
  const config: Record<string, unknown> = {
    ...provider.defaultConfig(),
    ...(opts.config ?? {}),
  };
  return {
    model: provider.buildModel(opts.modelId, config),
    metadata: provider.staticModels?.find((m) => m.id === opts.modelId),
  };
}
