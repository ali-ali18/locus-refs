import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DELETE, GET, PATCH } from "./route";

const { mockFindUnique, mockUpdateManyAndReturn, mockDeleteMany } = vi.hoisted(
  () => {
    return {
      mockFindUnique: vi.fn(),
      mockUpdateManyAndReturn: vi.fn(),
      mockDeleteMany: vi.fn(),
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
    note: {
      findUnique: mockFindUnique,
      updateManyAndReturn: mockUpdateManyAndReturn,
      deleteMany: mockDeleteMany,
    },
  },
}));

describe("API Note [id]", () => {
  const noteId = "note-1";
  const createParams = () => Promise.resolve({ id: noteId });

  beforeEach(() => {
    vi.clearAllMocks();
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
        where: { id: noteId, userId: "user-1" },
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
        where: { id: noteId, userId: "user-1" },
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
      mockDeleteMany.mockResolvedValue({ count: 1 });

      const req = new NextRequest(`http://localhost/api/notes/${noteId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ message: "Note deleted successfully" });
      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { id: noteId, userId: "user-1" },
      });
    });

    it("returns 404 when note is not found during deletion", async () => {
      mockDeleteMany.mockResolvedValue({ count: 0 });

      const req = new NextRequest(`http://localhost/api/notes/${noteId}`, {
        method: "DELETE",
      });

      const response = await DELETE(req, { params: createParams() });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Note not found" });
    });

    it("returns 500 when deletion fails", async () => {
      mockDeleteMany.mockRejectedValue(new Error("DB Error"));

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
