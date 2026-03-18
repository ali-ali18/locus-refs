import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DELETE } from "./route";

const { mockFindUnique, mockDelete } = vi.hoisted(() => {
  return {
    mockFindUnique: vi.fn(),
    mockDelete: vi.fn(),
  };
});

vi.mock("server-only", () => ({}));

vi.mock("@/server/getSession", () => ({
  getSession: vi.fn().mockResolvedValue({ user: { id: "user-1" } }),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    category: {
      findUnique: mockFindUnique,
      delete: mockDelete,
    },
  },
}));

describe("DELETE /api/categories/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 and deletes category when found and owned by user", async () => {
    const categoryId = "cat-1";
    mockFindUnique.mockResolvedValue({ id: categoryId, userId: "user-1" });
    mockDelete.mockResolvedValue({ id: categoryId });

    const req = new NextRequest(
      `http://localhost/api/categories/${categoryId}`,
      {
        method: "DELETE",
      },
    );
    const params = Promise.resolve({ id: categoryId });

    const response = await DELETE(req, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ message: "Category deleted successfully" });
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: categoryId, userId: "user-1" },
    });
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: categoryId } });
  });

  it("returns 404 when category is not found or not owned by user", async () => {
    const categoryId = "cat-missing";
    mockFindUnique.mockResolvedValue(null);

    const req = new NextRequest(
      `http://localhost/api/categories/${categoryId}`,
      {
        method: "DELETE",
      },
    );
    const params = Promise.resolve({ id: categoryId });

    const response = await DELETE(req, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: "Category not found" });
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: categoryId, userId: "user-1" },
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("returns 500 when deletion fails", async () => {
    const categoryId = "cat-1";
    mockFindUnique.mockResolvedValue({ id: categoryId, userId: "user-1" });
    mockDelete.mockRejectedValue(new Error("DB Error"));

    const req = new NextRequest(
      `http://localhost/api/categories/${categoryId}`,
      {
        method: "DELETE",
      },
    );
    const params = Promise.resolve({ id: categoryId });

    const response = await DELETE(req, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Failed to delete category" });
  });
});
