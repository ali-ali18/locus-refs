import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

const {
  mockFindMany,
  mockCreate,
  mockBoards,
} = vi.hoisted(() => {
  const boards = [
    {
      id: "kb-1",
      title: "Sprint",
      description: null,
      icon: null,
      workspaceId: "ws-1",
      createdById: "user-1",
      createdAt: new Date("2026-08-01T00:00:00.000Z"),
      updatedAt: new Date("2026-08-02T00:00:00.000Z"),
      deletedAt: null,
      lastOpenedAt: null,
      createdBy: { id: "user-1", name: "Alisson", image: null },
      _count: { cards: 0, columns: 3 },
    },
  ];

  return {
    mockFindMany: vi.fn().mockResolvedValue(boards),
    mockCreate: vi.fn(),
    mockBoards: boards,
  };
});

vi.mock("server-only", () => ({}));

vi.mock("@/server/requireSession", () => ({
  requireWorkspaceAccess: vi.fn().mockResolvedValue({
    session: { user: { id: "user-1" } },
    workspaceId: "ws-1",
    memberRole: "member",
  }),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    kanbanBoard: {
      findMany: mockFindMany,
      create: mockCreate,
    },
  },
}));

describe("API Kanban boards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindMany.mockResolvedValue(mockBoards);
  });

  describe("GET /api/kanban", () => {
    it("returns boards for the workspace", async () => {
      const req = new NextRequest("http://localhost/api/kanban", {
        headers: { "x-workspace-id": "ws-1" },
      });
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].title).toBe("Sprint");
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { workspaceId: "ws-1", deletedAt: null },
        }),
      );
    });
  });

  describe("POST /api/kanban", () => {
    it("creates a board with seeded columns", async () => {
      const created = {
        id: "kb-2",
        title: "Backlog",
        description: null,
        icon: null,
        workspaceId: "ws-1",
        createdById: "user-1",
        columns: [
          { id: "c1", name: "A fazer", position: 0 },
          { id: "c2", name: "Em andamento", position: 1 },
          { id: "c3", name: "Concluído", position: 2 },
        ],
        cards: [],
        createdBy: { id: "user-1", name: "Alisson", image: null },
      };
      mockCreate.mockResolvedValueOnce(created);

      const req = new NextRequest("http://localhost/api/kanban", {
        method: "POST",
        headers: {
          "x-workspace-id": "ws-1",
          "content-type": "application/json",
        },
        body: JSON.stringify({ title: "Backlog" }),
      });
      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.data.title).toBe("Backlog");
      expect(body.data.columns).toHaveLength(3);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: "Backlog",
            workspaceId: "ws-1",
            createdById: "user-1",
            columns: {
              create: expect.arrayContaining([
                expect.objectContaining({ name: "A fazer", position: 0 }),
                expect.objectContaining({ name: "Em andamento", position: 1 }),
                expect.objectContaining({ name: "Concluído", position: 2 }),
              ]),
            },
          }),
        }),
      );
    });

    it("returns 400 for invalid payload", async () => {
      const req = new NextRequest("http://localhost/api/kanban", {
        method: "POST",
        headers: {
          "x-workspace-id": "ws-1",
          "content-type": "application/json",
        },
        body: JSON.stringify({ title: "" }),
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });
});
