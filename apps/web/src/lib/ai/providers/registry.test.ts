import { describe, expect, it, vi } from "vitest";
import { anthropicProvider } from "./anthropic";
import { minimaxProvider } from "./minimax";
import {
  getProvider,
  listProviders,
  providerRegistry,
  resolveModel,
} from "./registry";

// Mock the AI SDK so resolveModel() does not hit a real network call.
vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn(() => "fake-anthropic-model"),
  createAnthropic: vi.fn(() => () => "fake-anthropic-model"),
}));

describe("providerRegistry", () => {
  it("contém exatamente 2 providers (anthropic, minimax) nessa ordem", () => {
    expect(providerRegistry).toHaveLength(2);
    expect(providerRegistry[0]).toBe(anthropicProvider);
    expect(providerRegistry[1]).toBe(minimaxProvider);
    expect(providerRegistry.map((p) => p.id)).toEqual(["anthropic", "minimax"]);
  });
});

describe("getProvider", () => {
  it("retorna o anthropicProvider quando id === 'anthropic'", () => {
    expect(getProvider("anthropic")).toBe(anthropicProvider);
  });

  it("retorna o minimaxProvider quando id === 'minimax'", () => {
    expect(getProvider("minimax")).toBe(minimaxProvider);
  });

  it("lança Error com id errado e lista de registrados quando provider não existe", () => {
    expect(() => getProvider("nao-existe")).toThrowError(
      /Provider "nao-existe" não registrado\. Registrados: anthropic, minimax\./,
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
