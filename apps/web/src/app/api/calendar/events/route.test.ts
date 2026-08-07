import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

const { mockFindMany, mockCreate } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCreate: vi.fn(),
}));

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
    calendarEvent: {
      findMany: mockFindMany,
      create: mockCreate,
    },
  },
}));

describe("API /api/calendar/events", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("lista eventos pessoais e do workspace no intervalo", async () => {
      const start = new Date("2026-08-10T12:00:00.000Z");
      mockFindMany.mockResolvedValue([
        {
          id: "ev-1",
          title: "Aula",
          description: null,
          startAt: start,
          endAt: new Date("2026-08-10T14:00:00.000Z"),
          allDay: false,
          remindAt: null,
          visibility: "personal",
          color: null,
          userId: "user-1",
          workspaceId: null,
          createdAt: start,
          updatedAt: start,
          user: { id: "user-1", name: "Ali", image: null },
        },
      ]);

      const req = new NextRequest(
        "http://localhost/api/calendar/events?from=2026-08-10T00:00:00.000Z&to=2026-08-17T00:00:00.000Z",
      );
      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].startAt).toBe(start.toISOString());
      expect(mockFindMany).toHaveBeenCalled();
    });

    it("rejeita query sem from/to", async () => {
      const req = new NextRequest("http://localhost/api/calendar/events");
      const res = await GET(req);
      expect(res.status).toBe(400);
    });
  });

  describe("POST", () => {
    it("cria evento pessoal sem workspaceId", async () => {
      const start = new Date("2026-08-10T15:00:00.000Z");
      mockCreate.mockResolvedValue({
        id: "ev-2",
        title: "Prova",
        description: null,
        startAt: start,
        endAt: null,
        allDay: false,
        remindAt: null,
        visibility: "personal",
        color: null,
        userId: "user-1",
        workspaceId: null,
        createdAt: start,
        updatedAt: start,
        user: { id: "user-1", name: "Ali", image: null },
      });

      const req = new NextRequest("http://localhost/api/calendar/events", {
        method: "POST",
        body: JSON.stringify({
          title: "Prova",
          startAt: start.toISOString(),
          allDay: false,
          visibility: "personal",
        }),
      });
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.data.workspaceId).toBeNull();
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            visibility: "personal",
            workspaceId: null,
            userId: "user-1",
          }),
        }),
      );
    });

    it("cria evento workspace com workspaceId", async () => {
      const start = new Date("2026-08-11T10:00:00.000Z");
      mockCreate.mockResolvedValue({
        id: "ev-3",
        title: "Standup",
        description: null,
        startAt: start,
        endAt: new Date("2026-08-11T10:30:00.000Z"),
        allDay: false,
        remindAt: null,
        visibility: "workspace",
        color: null,
        userId: "user-1",
        workspaceId: "ws-1",
        createdAt: start,
        updatedAt: start,
        user: { id: "user-1", name: "Ali", image: null },
      });

      const req = new NextRequest("http://localhost/api/calendar/events", {
        method: "POST",
        body: JSON.stringify({
          title: "Standup",
          startAt: start.toISOString(),
          endAt: "2026-08-11T10:30:00.000Z",
          allDay: false,
          visibility: "workspace",
        }),
      });
      const res = await POST(req);
      expect(res.status).toBe(201);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            visibility: "workspace",
            workspaceId: "ws-1",
          }),
        }),
      );
    });
  });
});
