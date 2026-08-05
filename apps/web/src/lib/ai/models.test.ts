import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn(() => "fake-anthropic-model"),
  createAnthropic: vi.fn(() => () => "fake-createAnthropic-model"),
}));

vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: vi.fn(() => () => "fake-openai-model"),
}));

import {
  AI_MODELS,
  DEFAULT_MODEL_ID,
  getAvailableModels,
  getModel,
} from "./models";

describe("models facade", () => {
  beforeEach(() => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("MINIMAX_API_KEY", "");
    vi.stubEnv("ATLASCLOUD_API_KEY", "");
    vi.stubEnv("GROQ_API_KEY", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("AI_MODELS", () => {
    it("inclui anthropic, minimax, atlas e groq", () => {
      expect(AI_MODELS).toHaveLength(20);
      expect(AI_MODELS.filter((m) => m.provider === "anthropic")).toHaveLength(
        2,
      );
      expect(AI_MODELS.filter((m) => m.provider === "minimax")).toHaveLength(2);
      expect(AI_MODELS.filter((m) => m.provider === "atlas")).toHaveLength(10);
      expect(AI_MODELS.filter((m) => m.provider === "groq")).toHaveLength(6);
    });

    it("expõe metadata não-vazio para cada modelo", () => {
      for (const m of AI_MODELS) {
        expect(m.metadata).toBeDefined();
        expect(m.metadata?.id).toBe(m.id);
        expect(m.metadata?.contextWindow).toBeGreaterThan(0);
      }
    });
  });

  describe("DEFAULT_MODEL_ID", () => {
    it("é 'claude-sonnet-4-6'", () => {
      expect(DEFAULT_MODEL_ID).toBe("claude-sonnet-4-6");
    });
  });

  describe("getModel", () => {
    it("retorna o modelo correto quando id existe e provider configurado", () => {
      vi.stubEnv("ANTHROPIC_API_KEY", "sk-fake");
      const m = getModel("claude-sonnet-4-6");

      expect(m).toBeDefined();
      expect(m.id).toBe("claude-sonnet-4-6");
      expect(m.provider).toBe("anthropic");
    });

    it("retorna modelo Atlas quando a key está setada", () => {
      vi.stubEnv("ATLASCLOUD_API_KEY", "atlas-fake");
      const m = getModel("atlas-deepseek-v4-pro");
      expect(m.id).toBe("atlas-deepseek-v4-pro");
      expect(m.provider).toBe("atlas");
    });

    it("retorna modelo Groq quando a key está setada", () => {
      vi.stubEnv("GROQ_API_KEY", "groq-fake");
      const m = getModel("groq-llama-3.3-70b");
      expect(m.id).toBe("groq-llama-3.3-70b");
      expect(m.provider).toBe("groq");
    });

    it("retorna DEFAULT_MODEL_ID quando id não existe", () => {
      vi.stubEnv("ANTHROPIC_API_KEY", "sk-fake");
      const m = getModel("nao-existe");

      expect(m.id).toBe(DEFAULT_MODEL_ID);
    });

    it("retorna DEFAULT_MODEL_ID quando id é null", () => {
      vi.stubEnv("ANTHROPIC_API_KEY", "sk-fake");
      const m = getModel(null);

      expect(m.id).toBe(DEFAULT_MODEL_ID);
    });

    it("retorna DEFAULT_MODEL_ID quando id é undefined", () => {
      vi.stubEnv("ANTHROPIC_API_KEY", "sk-fake");
      const m = getModel(undefined);

      expect(m.id).toBe(DEFAULT_MODEL_ID);
    });

    it("não retorna o id pedido se o provider não está configurado", () => {
      const m = getModel("claude-sonnet-4-6");
      expect(m).toBeUndefined();
    });
  });

  describe("getAvailableModels", () => {
    it("retorna 2 modelos (Anthropic) só com ANTHROPIC_API_KEY", () => {
      vi.stubEnv("ANTHROPIC_API_KEY", "sk-fake");

      const available = getAvailableModels();
      expect(available).toHaveLength(2);
      expect(available.map((m) => m.provider)).toEqual([
        "anthropic",
        "anthropic",
      ]);
    });

    it("retorna 2 modelos (Minimax) só com MINIMAX_API_KEY", () => {
      vi.stubEnv("MINIMAX_API_KEY", "minimax-fake");

      const available = getAvailableModels();
      expect(available).toHaveLength(2);
      expect(available.map((m) => m.provider)).toEqual(["minimax", "minimax"]);
    });

    it("retorna 10 modelos (Atlas) só com ATLASCLOUD_API_KEY", () => {
      vi.stubEnv("ATLASCLOUD_API_KEY", "atlas-fake");

      const available = getAvailableModels();
      expect(available).toHaveLength(10);
      expect(available.every((m) => m.provider === "atlas")).toBe(true);
    });

    it("retorna 6 modelos (Groq) só com GROQ_API_KEY", () => {
      vi.stubEnv("GROQ_API_KEY", "groq-fake");

      const available = getAvailableModels();
      expect(available).toHaveLength(6);
      expect(available.every((m) => m.provider === "groq")).toBe(true);
    });

    it("retorna 20 modelos quando todas as keys estão setadas", () => {
      vi.stubEnv("ANTHROPIC_API_KEY", "sk-fake");
      vi.stubEnv("MINIMAX_API_KEY", "minimax-fake");
      vi.stubEnv("ATLASCLOUD_API_KEY", "atlas-fake");
      vi.stubEnv("GROQ_API_KEY", "groq-fake");

      expect(getAvailableModels()).toHaveLength(20);
    });

    it("retorna 0 modelos quando nenhuma API key está setada", () => {
      expect(getAvailableModels()).toHaveLength(0);
    });
  });
});
