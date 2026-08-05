import { describe, expect, it, vi } from "vitest";
import { anthropicProvider } from "./anthropic";
import { atlasProvider } from "./atlas";
import { groqProvider } from "./groq";
import { minimaxProvider } from "./minimax";
import {
  getProvider,
  listProviders,
  providerRegistry,
  resolveModel,
} from "./registry";

vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn(() => "fake-anthropic-model"),
  createAnthropic: vi.fn(() => () => "fake-anthropic-model"),
}));

vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: vi.fn(() => {
    const provider = Object.assign(() => "fake-openai-model", {
      chat: () => "fake-openai-chat-model",
    });
    return provider;
  }),
}));

describe("providerRegistry", () => {
  it("contém anthropic, minimax, atlas e groq nessa ordem", () => {
    expect(providerRegistry).toHaveLength(4);
    expect(providerRegistry[0]).toBe(anthropicProvider);
    expect(providerRegistry[1]).toBe(minimaxProvider);
    expect(providerRegistry[2]).toBe(atlasProvider);
    expect(providerRegistry[3]).toBe(groqProvider);
    expect(providerRegistry.map((p) => p.id)).toEqual([
      "anthropic",
      "minimax",
      "atlas",
      "groq",
    ]);
  });
});

describe("getProvider", () => {
  it("retorna o anthropicProvider quando id === 'anthropic'", () => {
    expect(getProvider("anthropic")).toBe(anthropicProvider);
  });

  it("retorna o minimaxProvider quando id === 'minimax'", () => {
    expect(getProvider("minimax")).toBe(minimaxProvider);
  });

  it("retorna o atlasProvider quando id === 'atlas'", () => {
    expect(getProvider("atlas")).toBe(atlasProvider);
  });

  it("retorna o groqProvider quando id === 'groq'", () => {
    expect(getProvider("groq")).toBe(groqProvider);
  });

  it("lança Error com id errado e lista de registrados quando provider não existe", () => {
    expect(() => getProvider("nao-existe")).toThrowError(
      /Provider "nao-existe" não registrado\. Registrados: anthropic, minimax, atlas, groq\./,
    );
  });
});

describe("listProviders", () => {
  it("retorna o mesmo array do providerRegistry", () => {
    expect(listProviders()).toBe(providerRegistry);
  });
});

describe("resolveModel", () => {
  it("retorna { model, metadata } para um modelo estático conhecido", () => {
    const result = resolveModel({
      providerId: "anthropic",
      modelId: "claude-sonnet-4-6",
      config: { apiKey: "sk-fake" },
    });

    expect(result.model).toBeTruthy();
    expect(result.metadata).toBeDefined();
    expect(result.metadata?.id).toBe("claude-sonnet-4-6");
  });

  it("resolve modelo Atlas pelo id interno", () => {
    const result = resolveModel({
      providerId: "atlas",
      modelId: "atlas-deepseek-v4-pro",
      config: { apiKey: "atlas-fake" },
    });

    expect(result.model).toBeTruthy();
    expect(result.metadata?.modelId).toBe("deepseek-ai/deepseek-v4-pro");
  });

  it("resolve modelo Groq pelo id interno", () => {
    const result = resolveModel({
      providerId: "groq",
      modelId: "groq-llama-3.3-70b",
      config: { apiKey: "groq-fake" },
    });

    expect(result.model).toBeTruthy();
    expect(result.metadata?.modelId).toBe("llama-3.3-70b-versatile");
  });

  it("faz merge do config padrão com o config fornecido (config sobrescreve)", () => {
    const result = resolveModel({
      providerId: "anthropic",
      modelId: "claude-sonnet-4-6",
      config: { apiKey: "sk-explicit" },
    });

    expect(result.model).toBeTruthy();
    expect(result.metadata?.id).toBe("claude-sonnet-4-6");
  });

  it("propaga o erro de getProvider quando o providerId é inválido", () => {
    expect(() =>
      resolveModel({ providerId: "ghost", modelId: "anything" }),
    ).toThrowError(/Provider "ghost" não registrado/);
  });
});
