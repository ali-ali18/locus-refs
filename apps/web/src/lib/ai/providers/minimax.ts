import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

const MINIMAX_BASE_URL = "https://api.minimaxi.com/v1";

export function isMinimaxAvailable(): boolean {
  return !!process.env.MINIMAX_API_KEY;
}

export function buildMinimax(modelId: string): LanguageModel {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error(
      "MINIMAX_API_KEY não definida. Adicione ao .env para usar modelos MinMax.",
    );
  }

  const client = createOpenAI({
    apiKey,
    baseURL: MINIMAX_BASE_URL,
  });

  return client.chat(modelId);
}
