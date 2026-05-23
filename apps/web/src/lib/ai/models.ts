import type { LanguageModel } from "ai";
import { buildAnthropic } from "./providers/anthropic";
import { buildMinimax, isMinimaxAvailable } from "./providers/minimax";

export type AiProvider = "anthropic" | "minimax";

export interface AiModelDefinition {
  id: string;
  provider: AiProvider;
  label: string;
  description: string;
  isAvailable: () => boolean;
  build: () => LanguageModel;
}

export const AI_MODELS: readonly AiModelDefinition[] = [
  {
    id: "claude-sonnet-4-6",
    provider: "anthropic",
    label: "Claude Sonnet 4.6",
    description: "Equilíbrio entre velocidade e qualidade — recomendado",
    isAvailable: () => !!process.env.ANTHROPIC_API_KEY,
    build: () => buildAnthropic("claude-sonnet-4-6"),
  },
  {
    id: "claude-haiku-4-5",
    provider: "anthropic",
    label: "Claude Haiku 4.5",
    description: "Mais rápido para tarefas simples",
    isAvailable: () => !!process.env.ANTHROPIC_API_KEY,
    build: () => buildAnthropic("claude-haiku-4-5-20251001"),
  },
  {
    id: "minimax-m2.7",
    provider: "minimax",
    label: "MiniMax M2.7",
    description: "Modelo mais recente da MinMax — lançado março 2026",
    isAvailable: isMinimaxAvailable,
    build: () => buildMinimax("MiniMax-M2.7"),
  },
  {
    id: "minimax-m2.7-highspeed",
    provider: "minimax",
    label: "MiniMax M2.7 Highspeed",
    description: "Versão rápida do M2.7 — menor latência",
    isAvailable: isMinimaxAvailable,
    build: () => buildMinimax("MiniMax-M2.7-highspeed"),
  },
] as const;

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
