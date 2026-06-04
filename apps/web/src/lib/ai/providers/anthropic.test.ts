import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the AI SDK antes de importar o provider, para evitar chamadas reais.
const { mockAnthropic, mockCreateAnthropic } = vi.hoisted(() => {
  const mockAnthropic = vi.fn(() => "fake-anthropic-model");
  // createAnthropic(...) deve retornar uma função que produz o modelo.
  const mockCreateAnthropic = vi.fn(() => () => "fake-createAnthropic-model");
  return { mockAnthropic, mockCreateAnthropic };
});

vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: mockAnthropic,
  createAnthropic: mockCreateAnthropic,
}));

import {
  ANTHROPIC_CAPABILITIES,
  ANTHROPIC_STATIC_MODELS,
  anthropicConfigSchema,
  anthropicProvider,
} from "./anthropic";

describe("anthropicProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("ANTHROPIC_BASE_URL", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("tem id, name e capabilities esperadas", () => {
    expect(anthropicProvider.id).toBe("anthropic");
    expect(anthropicProvider.name).toBeTruthy();

    expect(anthropicProvider.capabilities).toEqual({
      toolCalling: true,
      vision: true,
      streaming: true,
      structuredOutput: true,
      jsonMode: true,
      systemPrompt: true,
      parallelToolCalls: true,
    });
    expect(anthropicProvider.capabilities).toBe(ANTHROPIC_CAPABILITIES);
  });

  describe("defaultConfig", () => {
    it("lê ANTHROPIC_API_KEY e ANTHROPIC_BASE_URL do ambiente", () => {
      vi.stubEnv("ANTHROPIC_API_KEY", "sk-env");
      vi.stubEnv("ANTHROPIC_BASE_URL", "https://env.example.com");

      const cfg = anthropicProvider.defaultConfig();
      expect(cfg).toEqual({
        apiKey: "sk-env",
        baseURL: "https://env.example.com",
      });
    });

    it("retorna apiKey vazia e baseURL undefined quando env não está setado", () => {
      vi.stubEnv("ANTHROPIC_API_KEY", "");
      vi.stubEnv("ANTHROPIC_BASE_URL", "");

      const cfg = anthropicProvider.defaultConfig();
      expect(cfg.apiKey).toBe("");
      expect(cfg.baseURL).toBeUndefined();
    });
  });

  describe("isConfigured", () => {
    it("retorna true quando apiKey é truthy", () => {
      expect(anthropicProvider.isConfigured({ apiKey: "sk-fake" })).toBe(true);
    });

    it("retorna false quando apiKey é string vazia", () => {
      expect(anthropicProvider.isConfigured({ apiKey: "" })).toBe(false);
    });
  });

  describe("configSchema", () => {
    it("aceita config válido", () => {
      const result = anthropicConfigSchema.safeParse({ apiKey: "sk-fake" });
      expect(result.success).toBe(true);
    });

    it("rejeita config com apiKey vazio", () => {
      const result = anthropicConfigSchema.safeParse({ apiKey: "" });
      expect(result.success).toBe(false);
    });

    it("rejeita config sem apiKey", () => {
      const result = anthropicConfigSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe("staticModels", () => {
    it("contém claude-sonnet-4-6 e claude-haiku-4-5 com metadata válida", () => {
      const sonnet = ANTHROPIC_STATIC_MODELS.find(
        (m) => m.id === "claude-sonnet-4-6",
      );
      const haiku = ANTHROPIC_STATIC_MODELS.find(
        (m) => m.id === "claude-haiku-4-5",
      );

      expect(sonnet).toBeDefined();
      expect(haiku).toBeDefined();

      for (const m of [sonnet, haiku]) {
        expect(m?.contextWindow).toBeGreaterThan(0);
        expect(m?.maxOutputTokens).toBeGreaterThan(0);
        expect(m?.inputModalities).toContain("text");
      }
    });

    it("claude-haiku-4-5 aponta para o SDK id com data", () => {
      const haiku = ANTHROPIC_STATIC_MODELS.find(
        (m) => m.id === "claude-haiku-4-5",
      );
      expect(haiku?.modelId).toBe("claude-haiku-4-5-20251001");
    });
  });

  describe("buildModel", () => {
    it("retorna algo truthy sem baseURL (usa anthropic direto)", () => {
      const result = anthropicProvider.buildModel("claude-sonnet-4-6", {
        apiKey: "sk-fake",
      });

      expect(result).toBeTruthy();
      expect(mockAnthropic).toHaveBeenCalledWith("claude-sonnet-4-6");
    });

    it("usa createAnthropic quando baseURL é fornecido", () => {
      const result = anthropicProvider.buildModel("claude-sonnet-4-6", {
        apiKey: "sk-fake",
        baseURL: "https://proxy.example.com",
      });

      expect(result).toBeTruthy();
      expect(mockCreateAnthropic).toHaveBeenCalledWith({
        apiKey: "sk-fake",
        baseURL: "https://proxy.example.com",
      });
    });
  });
});
