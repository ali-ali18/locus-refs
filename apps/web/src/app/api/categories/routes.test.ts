import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

const { mockFindMany, mockCreate, mockCategories } = vi.hoisted(() => {
  const categories = [
    { id: "cat-1", name: "Cat A", slug: "cat-a", userId: "user-1" },
    { id: "cat-2", name: "Cat B", slug: "cat-b", userId: "user-1" },
  ];
  return {
    mockFindMany: vi.fn().mockResolvedValue(categories),
    mockCreate: vi.fn(),
    mockCategories: categories,
  };
});

vi.mock("server-only", () => ({}));

vi.mock("@/server/requireSession", () => ({
  requireWorkspaceAccess: vi.fn().mockResolvedValue({
    session: { user: { id: "user-1" } },
    workspaceId: "ws-1",
  }),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    category: {
      findMany: mockFindMany,
      create: mockCreate,
    },
  },
}));

describe("API Categories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/categories", () => {
    it("returns 200 and user categories list when there is a session", async () => {
      const req = new NextRequest("http://localhost/api/categories", {
        headers: { "x-workspace-id": "ws-1" },
      });
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockCategories);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { workspaceId: "ws-1" },
        include: {
          _count: {
            select: {
              resources: true,
            },
          },
        },
        orderBy: { name: "asc" },
      });
    });
  });

  describe("POST /api/categories", () => {
    it("returns 201 and creates category when payload is valid", async () => {
      const newCategory = {
        id: "cat-new",
        name: "New Cat",
        slug: "new-cat",
        userId: "user-1",
      };
      mockCreate.mockResolvedValue(newCategory);

      const req = new NextRequest("http://localhost/api/categories", {
        method: "POST",
        body: JSON.stringify({ name: "New Cat" }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({
        message: "Category created successfully",
        category: newCategory,
      });

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          name: "New Cat",
          slug: "new-cat",
          userId: "user-1",
          workspaceId: "ws-1",
        },
      });
    });

    it("returns 400 when name is missing", async () => {
      const req = new NextRequest("http://localhost/api/categories", {
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

      const req = new NextRequest("http://localhost/api/categories", {
        method: "POST",
        body: JSON.stringify({ name: "Error Cat" }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to create category" });
    });
  });
});
