import { describe, expect, it } from "vitest";
import { buildThinkingProviderOptions } from "./thinking";
import type { ModelMetadata } from "./providers/types";

const anthropicAdaptive: ModelMetadata = {
  id: "claude",
  label: "Claude",
  contextWindow: 200_000,
  maxOutputTokens: 64_000,
  inputModalities: ["text"],
  outputModalities: ["text"],
  supportsThinking: true,
  thinkingMode: "adaptive",
};

const groqEffort: ModelMetadata = {
  id: "groq-gpt-oss",
  label: "GPT OSS",
  contextWindow: 131_072,
  maxOutputTokens: 65_536,
  inputModalities: ["text"],
  outputModalities: ["text"],
  supportsThinking: true,
  thinkingMode: "effort",
};

const groqToggle: ModelMetadata = {
  id: "groq-qwen",
  label: "Qwen",
  contextWindow: 131_072,
  maxOutputTokens: 16_384,
  inputModalities: ["text", "image"],
  outputModalities: ["text"],
  supportsThinking: true,
  thinkingMode: "toggle",
};

describe("buildThinkingProviderOptions", () => {
  it("retorna undefined sem supportsThinking", () => {
    expect(
      buildThinkingProviderOptions(
        { ...anthropicAdaptive, supportsThinking: false },
        true,
        "anthropic",
      ),
    ).toBeUndefined();
  });

  it("monta opções Anthropic adaptive", () => {
    expect(
      buildThinkingProviderOptions(anthropicAdaptive, true, "anthropic"),
    ).toEqual({
      anthropic: {
        thinking: { type: "adaptive" },
        sendReasoning: true,
      },
    });
  });

  it("monta opções OpenAI/Groq effort (gpt-oss)", () => {
    expect(buildThinkingProviderOptions(groqEffort, true, "openai")).toEqual({
      openai: { reasoningEffort: "medium" },
    });
    expect(buildThinkingProviderOptions(groqEffort, false, "openai")).toEqual({
      openai: { reasoningEffort: "low" },
    });
  });

  it("monta opções OpenAI/Groq toggle (Qwen)", () => {
    expect(buildThinkingProviderOptions(groqToggle, true, "openai")).toEqual({
      openai: { reasoningEffort: "default" },
    });
    expect(buildThinkingProviderOptions(groqToggle, false, "openai")).toEqual({
      openai: { reasoningEffort: "none" },
    });
  });
});
