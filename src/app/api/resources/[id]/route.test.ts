import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { PATCH, DELETE } from "./route";

const { mockFindFirst, mockFindUnique, mockUpdate, mockDelete } = vi.hoisted(() => {
  return {
    mockFindFirst: vi.fn(),
    mockFindUnique: vi.fn(),
    mockUpdate: vi.fn(),
    mockDelete: vi.fn(),
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
    resource: {
      findFirst: mockFindFirst,
      update: mockUpdate,
      delete: mockDelete,
    },
    collection: {
      findUnique: mockFindUnique,
    },
  },
}));

describe("API Resource [id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const resourceId = "res-1";
  const createParams = () => Promise.resolve({ id: resourceId });

  describe("PATCH /api/resources/[id]", () => {
    it("returns 200 and updates resource when found and owned by user", async () => {
      const existingResource = {
        id: resourceId,
        collectionId: "col-1",
        title: "Old Title",
      };
      
      mockFindFirst.mockResolvedValue(existingResource);
      
      const updatedResource = { ...existingResource, title: "New Title" };
      mockUpdate.mockResolvedValue(updatedResource);

      const req = new NextRequest(`http://localhost/api/resources/${resourceId}`, {
        method: "PATCH",
        body: JSON.stringify({ title: "New Title" }),
      });

      const response = await PATCH(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(updatedResource);
      
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: resourceId, collection: { userId: "user-1" } },
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: resourceId },
        data: { title: "New Title" },
        include: {
          categories: { select: { id: true, name: true, slug: true } },
        },
      });
    });

    it("returns 200 and validates new collection ownership if collectionId changes", async () => {
      const existingResource = {
        id: resourceId,
        collectionId: "col-1",
        title: "Resource",
      };
      const newCollectionId = "col-2";

      mockFindFirst.mockResolvedValue(existingResource);
      mockFindUnique.mockResolvedValue({ id: newCollectionId, userId: "user-1" });
      mockUpdate.mockResolvedValue({ ...existingResource, collectionId: newCollectionId });

      const req = new NextRequest(`http://localhost/api/resources/${resourceId}`, {
        method: "PATCH",
        body: JSON.stringify({ collectionId: newCollectionId }),
      });

      const response = await PATCH(req, { params: createParams() });
      
      expect(response.status).toBe(200);

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: newCollectionId, userId: "user-1" },
      });

      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ collectionId: newCollectionId })
      }));
    });

    it("returns 404 when resource is not found or not owned by user", async () => {
      mockFindFirst.mockResolvedValue(null);

      const req = new NextRequest(`http://localhost/api/resources/${resourceId}`, {
        method: "PATCH",
        body: JSON.stringify({ title: "New Title" }),
      });

      const response = await PATCH(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Resource not found" });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("returns 404 when new collection is not found or not owned by user", async () => {
      const existingResource = {
        id: resourceId,
        collectionId: "col-1",
      };
      const newCollectionId = "col-invalid";

      mockFindFirst.mockResolvedValue(existingResource);
      mockFindUnique.mockResolvedValue(null);

      const req = new NextRequest(`http://localhost/api/resources/${resourceId}`, {
        method: "PATCH",
        body: JSON.stringify({ collectionId: newCollectionId }),
      });

      const response = await PATCH(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Collection not found" });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("returns 500 when update fails in database", async () => {
      const existingResource = {
        id: resourceId,
        collectionId: "col-1",
      };
      mockFindFirst.mockResolvedValue(existingResource);
      mockUpdate.mockRejectedValue(new Error("DB Error"));

      const req = new NextRequest(`http://localhost/api/resources/${resourceId}`, {
        method: "PATCH",
        body: JSON.stringify({ title: "New Title" }),
      });

      const response = await PATCH(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to update resource" });
    });
  });

  describe("DELETE /api/resources/[id]", () => {
    it("returns 200 and deletes resource when found and owned by user", async () => {
      mockFindFirst.mockResolvedValue({ id: resourceId, collectionId: "col-1" });
      mockDelete.mockResolvedValue({ id: resourceId });

      const req = new NextRequest(`http://localhost/api/resources/${resourceId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ message: "Resource deleted successfully" });
      
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: resourceId, collection: { userId: "user-1" } },
      });
      expect(mockDelete).toHaveBeenCalledWith({ where: { id: resourceId } });
    });

    it("returns 404 when resource is not found or not owned by user", async () => {
      mockFindFirst.mockResolvedValue(null);

      const req = new NextRequest(`http://localhost/api/resources/${resourceId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Resource not found" });
      expect(mockDelete).not.toHaveBeenCalled();
    });

    it("returns 500 when deletion fails", async () => {
      mockFindFirst.mockResolvedValue({ id: resourceId, collectionId: "col-1" });
      mockDelete.mockRejectedValue(new Error("DB Error"));

      const req = new NextRequest(`http://localhost/api/resources/${resourceId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to delete resource" });
    });
  });
});
