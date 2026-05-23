import { createAnthropic } from "@ai-sdk/anthropic";
import type { LanguageModel } from "ai";

const MINIMAX_BASE_URL = "https://api.minimax.io/anthropic/v1";

export function isMinimaxAvailable(): boolean {
  return !!process.env.MINIMAX_API_KEY;
}

export function buildMinimax(modelId: string): LanguageModel {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error(
      "MINIMAX_API_KEY não definida. Adicione ao .env para usar modelos MiniMax.",
    );
  }

  const client = createAnthropic({
    apiKey,
    baseURL: MINIMAX_BASE_URL,
  });

  return client(modelId);
}
