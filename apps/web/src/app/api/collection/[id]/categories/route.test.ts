import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const { mockFindUnique, mockFindMany } = vi.hoisted(() => {
  return {
    mockFindUnique: vi.fn(),
    mockFindMany: vi.fn(),
  };
});

vi.mock("server-only", () => ({}));

vi.mock("@/server/requireSession", () => ({
  requireSession: vi.fn().mockResolvedValue({ user: { id: "user-1" } }),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    collection: {
      findUnique: mockFindUnique,
    },
    category: {
      findMany: mockFindMany,
    },
  },
}));

describe("API Collection [id]/categories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/collection/[id]/categories", () => {
    it("returns 200 and categories when collection is found and owned by user", async () => {
      const collectionId = "col-1";
      mockFindUnique.mockResolvedValue({
        id: collectionId,
        userId: "user-1",
        name: "Test Collection",
      });
      mockFindMany.mockResolvedValue([
        {
          id: "cat-1",
          name: "Technology",
          slug: "technology",
          _count: { resources: 5 },
        },
        {
          id: "cat-2",
          name: "Design",
          slug: "design",
          _count: { resources: 3 },
        },
      ]);

      const req = new NextRequest(
        `http://localhost/api/collection/${collectionId}/categories`,
        { method: "GET" },
      );
      const params = Promise.resolve({ id: collectionId });

      const response = await GET(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([
        {
          id: "cat-1",
          name: "Technology",
          slug: "technology",
          _count: { resources: 5 },
        },
        {
          id: "cat-2",
          name: "Design",
          slug: "design",
          _count: { resources: 3 },
        },
      ]);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: collectionId, userId: "user-1" },
      });
      expect(mockFindMany).toHaveBeenCalledWith({
        where: {
          resources: {
            some: {
              collectionId,
            },
          },
        },
        include: {
          _count: {
            select: {
              resources: {
                where: {
                  collectionId,
                },
              },
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });
    });

    it("returns 404 when collection is not found or not owned by user", async () => {
      const collectionId = "col-missing";
      mockFindUnique.mockResolvedValue(null);

      const req = new NextRequest(
        `http://localhost/api/collection/${collectionId}/categories`,
        { method: "GET" },
      );
      const params = Promise.resolve({ id: collectionId });

      const response = await GET(req, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Collection not found" });
      expect(mockFindMany).not.toHaveBeenCalled();
    });

    it("returns empty array when collection has no resources with categories", async () => {
      const collectionId = "col-1";
      mockFindUnique.mockResolvedValue({
        id: collectionId,
        userId: "user-1",
        name: "Empty Collection",
      });
      mockFindMany.mockResolvedValue([]);

      const req = new NextRequest(
        `http://localhost/api/collection/${collectionId}/categories`,
        { method: "GET" },
      );
      const params = Promise.resolve({ id: collectionId });

      const response = await GET(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });
  });
});
