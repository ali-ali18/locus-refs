import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateOpenAI } = vi.hoisted(() => {
  const mockCreateOpenAI = vi.fn(() => () => "fake-openai-model");
  return { mockCreateOpenAI };
});

vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: mockCreateOpenAI,
}));

import {
  ATLAS_CAPABILITIES,
  ATLAS_STATIC_MODELS,
  atlasConfigSchema,
  atlasProvider,
} from "./atlas";

describe("atlasProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("ATLASCLOUD_API_KEY", "");
    vi.stubEnv("ATLASCLOUD_BASE_URL", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("tem id, name e protocol openai", () => {
    expect(atlasProvider.id).toBe("atlas");
    expect(atlasProvider.name).toBe("Atlas Cloud");
    expect(atlasProvider.protocol).toBe("openai");
  });

  it("expõe capabilities de tool calling / streaming", () => {
    expect(atlasProvider.capabilities).toBe(ATLAS_CAPABILITIES);
    expect(atlasProvider.capabilities.toolCalling).toBe(true);
    expect(atlasProvider.capabilities.streaming).toBe(true);
  });

  describe("defaultConfig", () => {
    it("lê ATLASCLOUD_API_KEY do ambiente", () => {
      vi.stubEnv("ATLASCLOUD_API_KEY", "atlas-fake");
      expect(atlasProvider.defaultConfig().apiKey).toBe("atlas-fake");
    });

    it("usa baseURL default da Atlas", () => {
      expect(atlasProvider.defaultConfig().baseURL).toBe(
        "https://api.atlascloud.ai/v1",
      );
    });

    it("respeita ATLASCLOUD_BASE_URL quando setado", () => {
      vi.stubEnv("ATLASCLOUD_BASE_URL", "https://custom.example.com/v1");
      expect(atlasProvider.defaultConfig().baseURL).toBe(
        "https://custom.example.com/v1",
      );
    });
  });

  describe("isConfigured", () => {
    it("retorna true com key setada", () => {
      vi.stubEnv("ATLASCLOUD_API_KEY", "atlas-fake");
      expect(
        atlasProvider.isConfigured(atlasProvider.defaultConfig()),
      ).toBe(true);
    });

    it("retorna false com key vazia", () => {
      expect(
        atlasProvider.isConfigured(atlasProvider.defaultConfig()),
      ).toBe(false);
    });
  });

  describe("configSchema", () => {
    it("aceita config válido", () => {
      expect(
        atlasConfigSchema.safeParse({ apiKey: "atlas-fake" }).success,
      ).toBe(true);
    });

    it("rejeita apiKey vazio", () => {
      expect(atlasConfigSchema.safeParse({ apiKey: "" }).success).toBe(false);
    });
  });

  describe("staticModels", () => {
    it("contém 10 modelos curados do Coding Plan", () => {
      expect(ATLAS_STATIC_MODELS).toHaveLength(10);
      const ids = ATLAS_STATIC_MODELS.map((m) => m.id);
      expect(ids).toEqual([
        "atlas-deepseek-v4-pro",
        "atlas-deepseek-v4-flash",
        "atlas-glm-5.2",
        "atlas-glm-5.1",
        "atlas-kimi-k2.7-code",
        "atlas-kimi-k2.6",
        "atlas-kimi-k2.5",
        "atlas-minimax-m3",
        "atlas-minimax-m2.7",
        "atlas-qwen-3.6-plus",
      ]);
      for (const m of ATLAS_STATIC_MODELS) {
        expect(m.modelId).toMatch(/\//);
        expect(m.supportsTools).toBe(true);
        expect(m.contextWindow).toBeGreaterThan(0);
      }
    });

    it("marca visão nos modelos multimodais", () => {
      const withImage = ATLAS_STATIC_MODELS.filter((m) =>
        m.inputModalities.includes("image"),
      );
      expect(withImage.map((m) => m.id)).toEqual([
        "atlas-kimi-k2.6",
        "atlas-kimi-k2.5",
        "atlas-minimax-m3",
      ]);
    });
  });

  describe("buildModel", () => {
    it("lança erro quando apiKey está vazio", () => {
      expect(() =>
        atlasProvider.buildModel("deepseek-ai/deepseek-v4-pro", {
          apiKey: "",
        }),
      ).toThrowError(/ATLASCLOUD_API_KEY/i);
    });

    it("usa createOpenAI com apiKey e baseURL", () => {
      const result = atlasProvider.buildModel("deepseek-ai/deepseek-v4-pro", {
        apiKey: "atlas-fake",
      });
      expect(result).toBeTruthy();
      expect(mockCreateOpenAI).toHaveBeenCalledWith({
        apiKey: "atlas-fake",
        baseURL: "https://api.atlascloud.ai/v1",
      });
    });
  });
});
