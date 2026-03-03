import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

// Mock Auth
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  headers: vi.fn(() =>
    Promise.resolve(
      new Headers({
        Cookie: "better-auth.session_token=fake-session-token",
      }),
    ),
  ),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: { id: "user-1" },
      }),
    },
  },
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("POST /api/fetchMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 and metadata when URL is valid", async () => {
    const htmlContent = `
      <html>
        <head>
          <title>Test Page Title</title>
          <meta name="description" content="Test Page Description" />
          <meta property="og:image" content="http://example.com/image.png" />
          <link rel="icon" href="/favicon.ico" />
        </head>
      </html>
    `;

    mockFetch.mockResolvedValue({
      text: () => Promise.resolve(htmlContent),
      ok: true,
    });

    const req = new NextRequest("http://localhost/api/fetchMetadata", {
      method: "POST",
      body: JSON.stringify({ url: "http://example.com" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      title: "Test Page Title",
      description: "Test Page Description",
      ogImageUrl: "http://example.com/image.png",
      iconUrl: "http://example.com/favicon.ico", // Should resolve relative path
    });
  });

  it("returns 400 when URL is missing", async () => {
    const req = new NextRequest("http://localhost/api/fetchMetadata", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "URL is required" });
  });

  it("returns 500 when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network Error"));

    const req = new NextRequest("http://localhost/api/fetchMetadata", {
      method: "POST",
      body: JSON.stringify({ url: "http://example.com" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain("Failed to fetch URL");
  });
});
