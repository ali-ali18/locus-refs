import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";

const { mockFindMany, mockCreate, mockCollections } = vi.hoisted(() => {
  const collections = [
    { id: "col-1", name: "Collection A", userId: "user-1" },
    { id: "col-2", name: "Collection B", userId: "user-1" },
  ];
  return {
    mockFindMany: vi.fn().mockResolvedValue(collections),
    mockCreate: vi.fn(),
    mockCollections: collections,
  };
});

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() =>
    Promise.resolve(
      new Headers({
        Cookie: "better-auth.session_token=fake-session-token",
      })
    )
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

vi.mock("@/lib/prisma", () => ({
  default: {
    collection: {
      findMany: mockFindMany,
      create: mockCreate,
    },
  },
}));

describe("API Collections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/collection", () => {
    it("returns 200 and user collections list when session is valid", async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockCollections);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { name: "asc" },
      });
    });

    it("returns 500 when database query fails", async () => {
      mockFindMany.mockRejectedValueOnce(new Error("DB Error"));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to get collections" });
    });
  });

  describe("POST /api/collection", () => {
    it("returns 201 and creates collection when payload is valid", async () => {
      const newCollection = {
        id: "col-new",
        name: "New Collection",
        slug: "new-collection",
        userId: "user-1",
      };
      mockCreate.mockResolvedValue(newCollection);

      const req = new NextRequest("http://localhost/api/collection", {
        method: "POST",
        body: JSON.stringify({ name: "New Collection" }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({
        message: "Collection created successfully",
        collection: newCollection,
      });

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          name: "New Collection",
          slug: "new-collection",
          userId: "user-1",
        },
      });
    });

    it("returns 400 when name is missing", async () => {
      const req = new NextRequest("http://localhost/api/collection", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Name is required" });
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("returns 500 when database creation fails", async () => {
      mockCreate.mockRejectedValue(new Error("DB Error"));

      const req = new NextRequest("http://localhost/api/collection", {
        method: "POST",
        body: JSON.stringify({ name: "Error Collection" }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to create collection" });
    });
  });
});
