import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

const { mockFindMany, mockCreate, mockNotes } = vi.hoisted(() => {
  const notes = [
    {
      id: "note-1",
      title: "First Note",
      icon: "book",
      collectionId: "col-1",
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-02T00:00:00.000Z"),
    },
    {
      id: "note-2",
      title: "Second Note",
      icon: null,
      collectionId: null,
      createdAt: new Date("2024-01-03T00:00:00.000Z"),
      updatedAt: new Date("2024-01-04T00:00:00.000Z"),
    },
  ];

  return {
    mockFindMany: vi.fn().mockResolvedValue(notes),
    mockCreate: vi.fn(),
    mockNotes: notes,
  };
});

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
      findMany: mockFindMany,
      create: mockCreate,
    },
  },
}));

describe("API Notes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/notes", () => {
    it("returns 200 and the user notes list", async () => {
      const response = await GET();
      const data = await response.json();
      const expectedNotes = mockNotes.map((note) => ({
        ...note,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
      }));

      expect(response.status).toBe(200);
      expect(data).toEqual(expectedNotes);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          icon: true,
          collectionId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it("returns 500 when listing notes fails", async () => {
      mockFindMany.mockRejectedValueOnce(new Error("DB Error"));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to get notes" });
    });
  });

  describe("POST /api/notes", () => {
    it("returns 201 and creates a note when payload is valid", async () => {
      const createdNote = {
        id: "note-new",
        title: "New Note",
        icon: "archive",
        content: "",
        userId: "user-1",
        collectionId: "col-2",
      };

      mockCreate.mockResolvedValue(createdNote);

      const req = new NextRequest("http://localhost/api/notes", {
        method: "POST",
        body: JSON.stringify({
          title: "New Note",
          icon: "archive",
          collectionId: "col-2",
        }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({
        message: "Note created successfully",
        note: createdNote,
      });
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          title: "New Note",
          icon: "archive",
          content: "",
          userId: "user-1",
          collectionId: "col-2",
        },
      });
    });

    it("returns 400 when title is missing", async () => {
      const req = new NextRequest("http://localhost/api/notes", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: "Title is required",
        code: "MISSING_TITLE",
      });
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("stores nullable fields as null when omitted", async () => {
      const createdNote = {
        id: "note-nullable",
        title: "Plain Note",
        icon: null,
        content: "",
        userId: "user-1",
        collectionId: null,
      };

      mockCreate.mockResolvedValue(createdNote);

      const req = new NextRequest("http://localhost/api/notes", {
        method: "POST",
        body: JSON.stringify({ title: "Plain Note" }),
      });

      const response = await POST(req);

      expect(response.status).toBe(201);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          title: "Plain Note",
          icon: null,
          content: "",
          userId: "user-1",
          collectionId: null,
        },
      });
    });

    it("returns 500 when note creation fails", async () => {
      mockCreate.mockRejectedValueOnce(new Error("DB Error"));

      const req = new NextRequest("http://localhost/api/notes", {
        method: "POST",
        body: JSON.stringify({ title: "Broken Note" }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: "Failed to create note",
        code: "FAILED_TO_CREATE_NOTE",
      });
    });
  });
});
