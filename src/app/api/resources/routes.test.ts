import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./routes";

const { mockFindUnique, mockCreate, mockFindMany, mockResources } = vi.hoisted(
  () => {
    const resources = [
      {
        id: "res-1",
        title: "Resource 1",
        url: "https://res1.com",
        collectionId: "col-1",
        categories: [{ id: "cat-1", name: "Cat 1", slug: "cat-1" }],
      },
      {
        id: "res-2",
        title: "Resource 2",
        url: "https://res2.com",
        collectionId: "col-1",
        categories: [],
      },
    ];

    return {
      mockFindUnique: vi.fn(),
      mockCreate: vi.fn(),
      mockFindMany: vi.fn().mockResolvedValue(resources),
      mockResources: resources,
    };
  },
);

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

vi.mock("@/lib/prisma", () => ({
  default: {
    collection: {
      findUnique: mockFindUnique,
    },
    resource: {
      create: mockCreate,
      findMany: mockFindMany,
    },
  },
}));

describe("API Resources", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/resources", () => {
    it("returns 200 and user resources list with categories", async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockResources);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { collection: { userId: "user-1" } },
        include: {
          categories: { select: { id: true, name: true, slug: true } },
        },
      });
    });
  });

  describe("POST /api/resources", () => {
    it("returns 201 and creates resource when payload is valid and collection exists", async () => {
      const validPayload = {
        title: "New Resource",
        url: "https://example.com",
        collectionId: "col-1",
        categoryIds: ["cat-1", "cat-2"],
        description: "A description",
        iconUrl: "https://example.com/icon.png",
        ogImageUrl: "https://example.com/og.png",
      };

      mockFindUnique.mockResolvedValue({ id: "col-1", userId: "user-1" });

      mockCreate.mockResolvedValue({
        id: "res-new",
        ...validPayload,
        fetchedAt: new Date(),
        categories: [{ id: "cat-1" }, { id: "cat-2" }],
      });

      const req = new NextRequest("http://localhost/api/resources", {
        method: "POST",
        body: JSON.stringify(validPayload),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe("Resource created successfully");
      expect(data.resource).toEqual(
        expect.objectContaining({
          title: "New Resource",
          url: "https://example.com",
        }),
      );

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: "col-1", userId: "user-1" },
      });

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          title: "New Resource",
          url: "https://example.com",
          description: "A description",
          iconUrl: "https://example.com/icon.png",
          ogImageUrl: "https://example.com/og.png",
          collectionId: "col-1",
          fetchedAt: expect.any(Date),
          categories: {
            connect: [{ id: "cat-1" }, { id: "cat-2" }],
          },
        },
        include: {
          categories: true,
        },
      });
    });

    it("returns 400 when required fields are missing", async () => {
      const invalidPayload = {
        title: "Missing fields",
      };

      const req = new NextRequest("http://localhost/api/resources", {
        method: "POST",
        body: JSON.stringify(invalidPayload),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: "Title, URL, Collection ID and Category IDs are required",
      });
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("returns 404 when collection is not found or not owned by user", async () => {
      const payload = {
        title: "Resource",
        url: "https://example.com",
        collectionId: "col-missing",
        categoryIds: ["cat-1"],
      };

      mockFindUnique.mockResolvedValue(null);

      const req = new NextRequest("http://localhost/api/resources", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Collection not found" });
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("returns 500 when resource creation fails", async () => {
      const payload = {
        title: "Resource",
        url: "https://example.com",
        collectionId: "col-1",
        categoryIds: ["cat-1"],
      };

      mockFindUnique.mockResolvedValue({ id: "col-1", userId: "user-1" });
      mockCreate.mockRejectedValue(new Error("DB Error"));

      const req = new NextRequest("http://localhost/api/resources", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to create resource" });
    });
  });
});
