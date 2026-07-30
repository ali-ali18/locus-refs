import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the AI SDK antes de importar o provider.
const { mockCreateAnthropic } = vi.hoisted(() => {
  const mockCreateAnthropic = vi.fn(() => () => "fake-createAnthropic-model");
  return { mockCreateAnthropic };
});

vi.mock("@ai-sdk/anthropic", () => ({
  createAnthropic: mockCreateAnthropic,
}));

import { ANTHROPIC_CAPABILITIES } from "./anthropic";
import {
  MINIMAX_STATIC_MODELS,
  minimaxConfigSchema,
  minimaxProvider,
} from "./minimax";

describe("minimaxProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("MINIMAX_API_KEY", "");
    vi.stubEnv("MINIMAX_BASE_URL", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("tem id e name esperados", () => {
    expect(minimaxProvider.id).toBe("minimax");
    expect(minimaxProvider.name).toBeTruthy();
  });

  it("capabilities é idêntico ao do Anthropic", () => {
    expect(minimaxProvider.capabilities).toBe(ANTHROPIC_CAPABILITIES);
    expect(minimaxProvider.capabilities).toEqual({
      toolCalling: true,
      vision: true,
      streaming: true,
      structuredOutput: true,
      jsonMode: true,
      systemPrompt: true,
      parallelToolCalls: true,
    });
  });

  describe("defaultConfig", () => {
    it("lê MINIMAX_API_KEY do ambiente em apiKey", () => {
      vi.stubEnv("MINIMAX_API_KEY", "minimax-fake");

      const cfg = minimaxProvider.defaultConfig();
      expect(cfg.apiKey).toBe("minimax-fake");
    });

    it("retorna apiKey vazia quando env não está setado", () => {
      vi.stubEnv("MINIMAX_API_KEY", "");

      const cfg = minimaxProvider.defaultConfig();
      expect(cfg.apiKey).toBe("");
    });

    it("usa baseURL do env se setado, senão o default público", () => {
      vi.stubEnv("MINIMAX_BASE_URL", "");
      expect(minimaxProvider.defaultConfig().baseURL).toBe(
        "https://api.minimax.io/anthropic/v1",
      );

      vi.stubEnv("MINIMAX_BASE_URL", "https://custom.example.com/v1");
      expect(minimaxProvider.defaultConfig().baseURL).toBe(
        "https://custom.example.com/v1",
      );
    });
  });

  describe("isConfigured (== isMinimaxAvailable via defaultConfig)", () => {
    it("retorna true quando MINIMAX_API_KEY está setado no ambiente", () => {
      vi.stubEnv("MINIMAX_API_KEY", "minimax-fake");
      // O público do registry não expõe isMinimaxAvailable(); a fachada
      // chama provider.isConfigured(provider.defaultConfig()).
      expect(
        minimaxProvider.isConfigured(minimaxProvider.defaultConfig()),
      ).toBe(true);
    });

    it("retorna false quando MINIMAX_API_KEY está vazio", () => {
      vi.stubEnv("MINIMAX_API_KEY", "");
      expect(
        minimaxProvider.isConfigured(minimaxProvider.defaultConfig()),
      ).toBe(false);
    });
  });

  describe("configSchema", () => {
    it("aceita config válido", () => {
      const result = minimaxConfigSchema.safeParse({ apiKey: "minimax-fake" });
      expect(result.success).toBe(true);
    });

    it("rejeita config com apiKey vazio", () => {
      const result = minimaxConfigSchema.safeParse({ apiKey: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("staticModels", () => {
    it("contém minimax-m2.7 e minimax-m3 com metadata válida", () => {
      const m27 = MINIMAX_STATIC_MODELS.find((m) => m.id === "minimax-m2.7");
      const m3 = MINIMAX_STATIC_MODELS.find((m) => m.id === "minimax-m3");

      expect(m27).toBeDefined();
      expect(m3).toBeDefined();

      for (const m of [m27, m3]) {
        expect(m?.contextWindow).toBeGreaterThan(0);
        expect(m?.maxOutputTokens).toBeGreaterThan(0);
        expect(m?.inputModalities).toContain("text");
      }
      expect(m3?.inputModalities).toContain("image");
    });

    it("aponta modelId para os IDs da SDK", () => {
      const m27 = MINIMAX_STATIC_MODELS.find((m) => m.id === "minimax-m2.7");
      const m3 = MINIMAX_STATIC_MODELS.find((m) => m.id === "minimax-m3");

      expect(m27?.modelId).toBe("MiniMax-M2.7");
      expect(m3?.modelId).toBe("MiniMax-M3");
    });
  });

  describe("buildModel", () => {
    it("lança erro em PT quando apiKey está vazio", () => {
      // O zod schema exige min(1); o erro retornado é um ZodError com a
      // mensagem "MINIMAX_API_KEY é obrigatória".
      expect(() =>
        minimaxProvider.buildModel("minimax-m2.7", { apiKey: "" }),
      ).toThrowError(/MINIMAX_API_KEY/i);
    });

    it("retorna algo truthy quando apiKey é fornecido", () => {
      const result = minimaxProvider.buildModel("minimax-m2.7", {
        apiKey: "minimax-fake",
      });

      expect(result).toBeTruthy();
      expect(mockCreateAnthropic).toHaveBeenCalled();
    });
  });
});
