import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DELETE, PATCH } from "./route";

const { mockFindUnique, mockUpdate, mockDelete } = vi.hoisted(() => {
  return {
    mockFindUnique: vi.fn(),
    mockUpdate: vi.fn(),
    mockDelete: vi.fn(),
  };
});

vi.mock("server-only", () => ({}));

vi.mock("@/server/getSession", () => ({
  getSession: vi.fn().mockResolvedValue({ user: { id: "user-1" } }),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    collection: {
      findUnique: mockFindUnique,
      update: mockUpdate,
      delete: mockDelete,
    },
  },
}));

describe("API Collection [id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PATCH /api/collection/[id]", () => {
    it("returns 200 and updates collection when found and owned by user", async () => {
      const collectionId = "col-1";
      const updatedName = "Updated Collection";
      const existingCollection = {
        id: collectionId,
        userId: "user-1",
        name: "Old Name",
      };
      const updatedCollection = { ...existingCollection, name: updatedName };

      mockFindUnique.mockResolvedValue(existingCollection);
      mockUpdate.mockResolvedValue(updatedCollection);

      const req = new NextRequest(
        `http://localhost/api/collection/${collectionId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ name: updatedName }),
        },
      );
      const params = Promise.resolve({ id: collectionId });

      const response = await PATCH(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: "Collection updated successfully",
        collection: updatedCollection,
      });
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: collectionId, userId: "user-1" },
      });
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: collectionId },
        data: { name: updatedName },
      });
    });

    it("returns 404 when collection is not found or not owned by user", async () => {
      const collectionId = "col-missing";
      mockFindUnique.mockResolvedValue(null);

      const req = new NextRequest(
        `http://localhost/api/collection/${collectionId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ name: "New Name" }),
        },
      );
      const params = Promise.resolve({ id: collectionId });

      const response = await PATCH(req, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Collection not found" });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("returns 500 when update fails", async () => {
      const collectionId = "col-1";
      mockFindUnique.mockResolvedValue({ id: collectionId, userId: "user-1" });
      mockUpdate.mockRejectedValue(new Error("DB Error"));

      const req = new NextRequest(
        `http://localhost/api/collection/${collectionId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ name: "Updated Name" }),
        },
      );
      const params = Promise.resolve({ id: collectionId });

      const response = await PATCH(req, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to update collection" });
    });
  });

  describe("DELETE /api/collection/[id]", () => {
    it("returns 200 and deletes collection when found and owned by user", async () => {
      const collectionId = "col-1";
      mockFindUnique.mockResolvedValue({ id: collectionId, userId: "user-1" });
      mockDelete.mockResolvedValue({ id: collectionId });

      const req = new NextRequest(
        `http://localhost/api/collection/${collectionId}`,
        {
          method: "DELETE",
        },
      );
      const params = Promise.resolve({ id: collectionId });

      const response = await DELETE(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ message: "Collection deleted successfully" });
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: collectionId, userId: "user-1" },
      });
      expect(mockDelete).toHaveBeenCalledWith({ where: { id: collectionId } });
    });

    it("returns 404 when collection is not found or not owned by user", async () => {
      const collectionId = "col-missing";
      mockFindUnique.mockResolvedValue(null);

      const req = new NextRequest(
        `http://localhost/api/collection/${collectionId}`,
        {
          method: "DELETE",
        },
      );
      const params = Promise.resolve({ id: collectionId });

      const response = await DELETE(req, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Collection not found" });
      expect(mockDelete).not.toHaveBeenCalled();
    });

    it("returns 500 when deletion fails", async () => {
      const collectionId = "col-1";
      mockFindUnique.mockResolvedValue({ id: collectionId, userId: "user-1" });
      mockDelete.mockRejectedValue(new Error("DB Error"));

      const req = new NextRequest(
        `http://localhost/api/collection/${collectionId}`,
        {
          method: "DELETE",
        },
      );
      const params = Promise.resolve({ id: collectionId });

      const response = await DELETE(req, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to delete collection" });
    });
  });
});
