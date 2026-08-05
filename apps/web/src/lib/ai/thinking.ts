import type { ModelMetadata } from "./providers/types";

const DEFAULT_THINKING_BUDGET_TOKENS = 10_000;

type AnthropicThinkingOption =
  | { type: "adaptive" }
  | { type: "enabled"; budgetTokens: number }
  | { type: "disabled" };

type OpenAiReasoningEffort = "low" | "medium" | "high" | "none" | "default";

type AnthropicThinkingProviderOptions = {
  anthropic: { thinking: AnthropicThinkingOption; sendReasoning: boolean };
};

/** Via createOpenAI apontando para Groq (OpenAI-compatible). */
type OpenAiThinkingProviderOptions = {
  openai: {
    reasoningEffort: OpenAiReasoningEffort;
  };
};

export type ThinkingProviderOptions =
  | AnthropicThinkingProviderOptions
  | OpenAiThinkingProviderOptions;

/**
 * Opções de thinking por provider:
 * - Anthropic-compatible (Claude, MiniMax): thinking + sendReasoning
 * - Groq reasoning via OpenAI-compat (gpt-oss / Qwen): reasoningEffort
 */
export function buildThinkingProviderOptions(
  metadata: ModelMetadata | undefined,
  thinkingEnabled: boolean,
  protocol: "anthropic" | "openai" = "anthropic",
): ThinkingProviderOptions | undefined {
  if (!metadata?.supportsThinking) return undefined;

  if (
    metadata.thinkingMode === "effort" ||
    metadata.thinkingMode === "toggle"
  ) {
    const reasoningEffort: OpenAiReasoningEffort =
      metadata.thinkingMode === "toggle"
        ? thinkingEnabled
          ? "default"
          : "none"
        : thinkingEnabled
          ? "medium"
          : "low";

    return {
      openai: { reasoningEffort },
    };
  }

  if (protocol !== "anthropic") return undefined;

  const thinking: AnthropicThinkingOption = thinkingEnabled
    ? metadata.thinkingMode === "budget"
      ? { type: "enabled", budgetTokens: DEFAULT_THINKING_BUDGET_TOKENS }
      : { type: "adaptive" }
    : { type: "disabled" };

  return {
    anthropic: {
      thinking,
      sendReasoning: thinkingEnabled,
    },
  };
}
