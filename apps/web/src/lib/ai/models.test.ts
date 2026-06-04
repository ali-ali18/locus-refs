import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the AI SDK para isAvailable() e build() poderem rodar sem rede.
vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn(() => "fake-anthropic-model"),
  createAnthropic: vi.fn(() => () => "fake-createAnthropic-model"),
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
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("AI_MODELS", () => {
    it("tem 4 modelos com os ids esperados", () => {
      expect(AI_MODELS).toHaveLength(4);
      expect(AI_MODELS.map((m) => m.id)).toEqual([
        "claude-sonnet-4-6",
        "claude-haiku-4-5",
        "minimax-m2.7",
        "minimax-m2.7-highspeed",
      ]);
    });

    it("atribui os providers corretamente por posição", () => {
      expect(AI_MODELS[0].provider).toBe("anthropic");
      expect(AI_MODELS[1].provider).toBe("anthropic");
      expect(AI_MODELS[2].provider).toBe("minimax");
      expect(AI_MODELS[3].provider).toBe("minimax");
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
      // Sem env setado, ANTHROPIC não está disponível, então o fallback
      // para DEFAULT_MODEL_ID (claude-sonnet-4-6) também não vai achar nada
      // — cai em available[0] que é undefined.
      const m = getModel("claude-sonnet-4-6");
      expect(m).toBeUndefined();
    });
  });

  describe("getAvailableModels", () => {
    it("retorna 2 modelos (Anthropic) com ANTHROPIC_API_KEY setado e MINIMAX_API_KEY vazio", () => {
      vi.stubEnv("ANTHROPIC_API_KEY", "sk-fake");
      vi.stubEnv("MINIMAX_API_KEY", "");

      const available = getAvailableModels();
      expect(available).toHaveLength(2);
      expect(available.map((m) => m.provider)).toEqual([
        "anthropic",
        "anthropic",
      ]);
      expect(available.map((m) => m.id)).toEqual([
        "claude-sonnet-4-6",
        "claude-haiku-4-5",
      ]);
    });

    it("retorna 2 modelos (Minimax) com MINIMAX_API_KEY setado e ANTHROPIC_API_KEY vazio", () => {
      vi.stubEnv("ANTHROPIC_API_KEY", "");
      vi.stubEnv("MINIMAX_API_KEY", "minimax-fake");

      const available = getAvailableModels();
      expect(available).toHaveLength(2);
      expect(available.map((m) => m.provider)).toEqual(["minimax", "minimax"]);
      expect(available.map((m) => m.id)).toEqual([
        "minimax-m2.7",
        "minimax-m2.7-highspeed",
      ]);
    });

    it("retorna 4 modelos quando ambas as API keys estão setadas", () => {
      vi.stubEnv("ANTHROPIC_API_KEY", "sk-fake");
      vi.stubEnv("MINIMAX_API_KEY", "minimax-fake");

      const available = getAvailableModels();
      expect(available).toHaveLength(4);
    });

    it("retorna 0 modelos quando nenhuma API key está setada", () => {
      vi.stubEnv("ANTHROPIC_API_KEY", "");
      vi.stubEnv("MINIMAX_API_KEY", "");

      const available = getAvailableModels();
      expect(available).toHaveLength(0);
    });
  });
});
