import type { LanguageModel } from "ai";
import { providerRegistry } from "./providers/registry";
import type { ModelMetadata, ProviderDefinition } from "./providers/types";

export type AiProvider = ProviderDefinition["id"];

export interface AiModelDefinition {
  id: string;
  provider: AiProvider;
  label: string;
  description: string;
  isAvailable: () => boolean;
  build: () => LanguageModel;
  metadata?: ModelMetadata;
}

function flattenRegistry(): AiModelDefinition[] {
  const result: AiModelDefinition[] = [];
  for (const provider of providerRegistry) {
    for (const model of provider.staticModels ?? []) {
      if (model.deprecated) continue;
      result.push({
        id: model.id,
        provider: provider.id,
        label: model.label,
        description: model.description ?? "",
        isAvailable: () => provider.isConfigured(provider.defaultConfig()),
        build: () =>
          provider.buildModel(
            model.modelId ?? model.id,
            provider.defaultConfig(),
          ),
        metadata: model,
      });
    }
  }
  return result;
}

export const AI_MODELS: readonly AiModelDefinition[] = flattenRegistry();

export const DEFAULT_MODEL_ID = "claude-sonnet-4-6";

export function getAvailableModels(): readonly AiModelDefinition[] {
  return AI_MODELS.filter((m) => m.isAvailable());
}

export function getModel(id?: string | null): AiModelDefinition {
  const available = getAvailableModels();
  return (
    available.find((m) => m.id === id) ??
    available.find((m) => m.id === DEFAULT_MODEL_ID) ??
    available[0]
  );
}
