import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateOpenAI, mockChat } = vi.hoisted(() => {
  const mockChat = vi.fn(() => "fake-openai-model");
  const mockCreateOpenAI = vi.fn(() => ({ chat: mockChat }));
  return { mockCreateOpenAI, mockChat };
});

vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: mockCreateOpenAI,
}));

import {
  GROQ_CAPABILITIES,
  GROQ_STATIC_MODELS,
  groqConfigSchema,
  groqProvider,
} from "./groq";

describe("groqProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("GROQ_API_KEY", "");
    vi.stubEnv("GROQ_BASE_URL", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("tem id, name e protocol openai", () => {
    expect(groqProvider.id).toBe("groq");
    expect(groqProvider.name).toBe("Groq");
    expect(groqProvider.protocol).toBe("openai");
  });

  it("expõe capabilities de tool calling / streaming", () => {
    expect(groqProvider.capabilities).toBe(GROQ_CAPABILITIES);
    expect(groqProvider.capabilities.toolCalling).toBe(true);
    expect(groqProvider.capabilities.streaming).toBe(true);
  });

  describe("defaultConfig", () => {
    it("lê GROQ_API_KEY do ambiente", () => {
      vi.stubEnv("GROQ_API_KEY", "groq-fake");
      expect(groqProvider.defaultConfig().apiKey).toBe("groq-fake");
    });

    it("usa baseURL default da Groq", () => {
      expect(groqProvider.defaultConfig().baseURL).toBe(
        "https://api.groq.com/openai/v1",
      );
    });

    it("respeita GROQ_BASE_URL quando setado", () => {
      vi.stubEnv("GROQ_BASE_URL", "https://custom.example.com/v1");
      expect(groqProvider.defaultConfig().baseURL).toBe(
        "https://custom.example.com/v1",
      );
    });
  });

  describe("isConfigured", () => {
    it("retorna true com key setada", () => {
      vi.stubEnv("GROQ_API_KEY", "groq-fake");
      expect(groqProvider.isConfigured(groqProvider.defaultConfig())).toBe(
        true,
      );
    });

    it("retorna false com key vazia", () => {
      expect(groqProvider.isConfigured(groqProvider.defaultConfig())).toBe(
        false,
      );
    });
  });

  describe("configSchema", () => {
    it("aceita config válido", () => {
      expect(groqConfigSchema.safeParse({ apiKey: "groq-fake" }).success).toBe(
        true,
      );
    });

    it("rejeita apiKey vazio", () => {
      expect(groqConfigSchema.safeParse({ apiKey: "" }).success).toBe(false);
    });
  });

  describe("staticModels", () => {
    it("contém modelos chat curados", () => {
      expect(GROQ_STATIC_MODELS).toHaveLength(6);
      expect(GROQ_STATIC_MODELS.map((m) => m.id)).toEqual([
        "groq-llama-3.3-70b",
        "groq-llama-3.1-8b",
        "groq-gpt-oss-120b",
        "groq-gpt-oss-20b",
        "groq-qwen-3.6-27b",
        "groq-allam-2-7b",
      ]);
    });

    it("marca visão no Qwen 3.6 27B", () => {
      const qwen = GROQ_STATIC_MODELS.find((m) => m.id === "groq-qwen-3.6-27b");
      expect(qwen?.inputModalities).toContain("image");
    });

    it("marca reasoning nos modelos GPT OSS e Qwen", () => {
      for (const id of [
        "groq-gpt-oss-120b",
        "groq-gpt-oss-20b",
        "groq-qwen-3.6-27b",
      ]) {
        const model = GROQ_STATIC_MODELS.find((m) => m.id === id);
        expect(model?.supportsThinking).toBe(true);
      }
      expect(
        GROQ_STATIC_MODELS.find((m) => m.id === "groq-gpt-oss-120b")
          ?.thinkingMode,
      ).toBe("effort");
      expect(
        GROQ_STATIC_MODELS.find((m) => m.id === "groq-qwen-3.6-27b")
          ?.thinkingMode,
      ).toBe("toggle");
    });

    it("ALLaM não expõe custom tools", () => {
      expect(
        GROQ_STATIC_MODELS.find((m) => m.id === "groq-allam-2-7b")?.supportsTools,
      ).toBe(false);
    });
  });

  describe("buildModel", () => {
    it("lança erro quando apiKey está vazio", () => {
      expect(() =>
        groqProvider.buildModel("llama-3.3-70b-versatile", { apiKey: "" }),
      ).toThrowError(/GROQ_API_KEY/i);
    });

    it("usa createOpenAI().chat com apiKey e baseURL", () => {
      const result = groqProvider.buildModel("llama-3.3-70b-versatile", {
        apiKey: "groq-fake",
      });
      expect(result).toBeTruthy();
      expect(mockCreateOpenAI).toHaveBeenCalledWith({
        apiKey: "groq-fake",
        baseURL: "https://api.groq.com/openai/v1",
      });
      expect(mockChat).toHaveBeenCalledWith("llama-3.3-70b-versatile");
    });
  });
});
