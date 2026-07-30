import type { ModelMetadata } from "./providers/types";

const DEFAULT_THINKING_BUDGET_TOKENS = 10_000;

type AnthropicThinkingOption =
  | { type: "adaptive" }
  | { type: "enabled"; budgetTokens: number }
  | { type: "disabled" };

/**
 * Opções Anthropic-compatible para thinking (Claude + MiniMax via createAnthropic).
 * Retorna undefined quando o modelo não suporta thinking.
 */
export function buildThinkingProviderOptions(
  metadata: ModelMetadata | undefined,
  thinkingEnabled: boolean,
): { anthropic: { thinking: AnthropicThinkingOption; sendReasoning: boolean } } | undefined {
  if (!metadata?.supportsThinking) return undefined;

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
