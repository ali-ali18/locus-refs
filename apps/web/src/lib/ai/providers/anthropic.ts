import { anthropic } from "@ai-sdk/anthropic";
import type { LanguageModel } from "ai";

export function buildAnthropic(modelId: string): LanguageModel {
  return anthropic(modelId);
}
