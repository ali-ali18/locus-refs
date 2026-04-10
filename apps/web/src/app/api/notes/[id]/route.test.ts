import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DELETE, GET, PATCH } from "./route";

const { mockFindUnique, mockUpdateManyAndReturn, mockDelete } = vi.hoisted(
  () => {
    return {
      mockFindUnique: vi.fn(),
      mockUpdateManyAndReturn: vi.fn(),
      mockDelete: vi.fn(),
    };
  },
);

vi.mock("server-only", () => ({}));

vi.mock("@/server/requireSession", () => ({
  requireWorkspaceAccess: vi.fn().mockResolvedValue({
    session: { user: { id: "user-1" } },
    workspaceId: "ws-1",
  }),
}));

vi.mock("@/server/upload", () => ({
  deleteObjects: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    note: {
      findUnique: mockFindUnique,
      updateManyAndReturn: mockUpdateManyAndReturn,
      delete: mockDelete,
    },
  },
}));

describe("API Note [id]", () => {
  const noteId = "note-1";
  const createParams = () => Promise.resolve({ id: noteId });

  beforeEach(() => {
    vi.clearAllMocks();
    mockFindUnique.mockResolvedValue(null);
  });

  describe("GET /api/notes/[id]", () => {
    it("returns 200 and note data when note belongs to the user", async () => {
      const note = {
        id: noteId,
        title: "My Note",
        icon: "book",
        content: "content",
        collection: { id: "col-1", name: "Collection" },
        linkedTo: [],
        linkedFrom: [],
      };

      mockFindUnique.mockResolvedValue(note);

      const req = new NextRequest(`http://localhost/api/notes/${noteId}`);
      const response = await GET(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(note);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: noteId, workspaceId: "ws-1" },
        include: {
          collection: { select: { id: true, name: true } },
          linkedTo: {
            select: {
              target: { select: { id: true, title: true, icon: true } },
            },
          },
          linkedFrom: {
            select: {
              source: { select: { id: true, title: true, icon: true } },
            },
          },
        },
      });
    });

    it("returns 404 when note is not found", async () => {
      mockFindUnique.mockResolvedValue(null);

      const req = new NextRequest(`http://localhost/api/notes/${noteId}`);
      const response = await GET(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Note not found" });
    });

    it("returns 500 when note query fails", async () => {
      mockFindUnique.mockRejectedValue(new Error("DB Error"));

      const req = new NextRequest(`http://localhost/api/notes/${noteId}`);
      const response = await GET(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to get note" });
    });
  });

  describe("PATCH /api/notes/[id]", () => {
    it("returns 200 and updates note when note belongs to the user", async () => {
      const updatedNote = {
        id: noteId,
        title: "Updated Note",
        icon: "archive",
        content: "updated content",
        collectionId: "col-2",
      };

      mockFindUnique.mockResolvedValue({ content: null });
      mockUpdateManyAndReturn.mockResolvedValue([updatedNote]);

      const req = new NextRequest(`http://localhost/api/notes/${noteId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: "Updated Note",
          icon: "archive",
          content: "updated content",
          collectionId: "col-2",
        }),
      });

      const response = await PATCH(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: "Note updated successfully",
        note: updatedNote,
      });
      expect(mockUpdateManyAndReturn).toHaveBeenCalledWith({
        where: { id: noteId, workspaceId: "ws-1" },
        data: {
          title: "Updated Note",
          icon: "archive",
          content: "updated content",
          collectionId: "col-2",
        },
      });
    });

    it("returns 404 when note is not found during update", async () => {
      mockUpdateManyAndReturn.mockResolvedValue([]);

      const req = new NextRequest(`http://localhost/api/notes/${noteId}`, {
        method: "PATCH",
        body: JSON.stringify({ title: "Updated Note" }),
      });

      const response = await PATCH(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Note not found" });
    });

    it("returns 500 when update fails", async () => {
      mockUpdateManyAndReturn.mockRejectedValue(new Error("DB Error"));

      const req = new NextRequest(`http://localhost/api/notes/${noteId}`, {
        method: "PATCH",
        body: JSON.stringify({ title: "Updated Note" }),
      });

      const response = await PATCH(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to update note" });
    });
  });

  describe("DELETE /api/notes/[id]", () => {
    it("returns 200 and deletes note when note belongs to the user", async () => {
      mockFindUnique.mockResolvedValue({ content: null });
      mockDelete.mockResolvedValue(undefined);

      const req = new NextRequest(`http://localhost/api/notes/${noteId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ message: "Note deleted successfully" });
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: noteId },
      });
    });

    it("returns 404 when note is not found during deletion", async () => {
      mockFindUnique.mockResolvedValue(null);

      const req = new NextRequest(`http://localhost/api/notes/${noteId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Note not found" });
    });

    it("returns 500 when deletion fails", async () => {
      mockFindUnique.mockResolvedValue({ content: null });
      mockDelete.mockRejectedValue(new Error("DB Error"));

      const req = new NextRequest(`http://localhost/api/notes/${noteId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to delete note" });
    });
  });
});
