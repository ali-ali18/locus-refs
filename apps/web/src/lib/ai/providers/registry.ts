import type { LanguageModel } from "ai";
import { anthropicProvider } from "./anthropic";
import { atlasProvider } from "./atlas";
import { minimaxProvider } from "./minimax";
import type { ModelMetadata, ProviderDefinition } from "./types";

export const providerRegistry: readonly ProviderDefinition[] = [
  anthropicProvider,
  minimaxProvider,
  atlasProvider,
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
  const metadata = provider.staticModels?.find(
    (m) => m.id === opts.modelId || m.modelId === opts.modelId,
  );
  const apiModelId = metadata?.modelId ?? opts.modelId;
  return {
    model: provider.buildModel(apiModelId, config),
    metadata,
  };
}
