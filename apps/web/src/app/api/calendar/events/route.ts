import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  calendarEventInclude,
  resolveAssigneeIds,
  serializeCalendarEvent,
} from "@/server/calendar-event";
import { requireWorkspacePermission } from "@/server/permissions";
import {
  createCalendarEventSchema,
  listCalendarEventsQuerySchema,
} from "@/types/schema/calendar-event.schema";

export async function GET(request: NextRequest) {
  const auth = await requireWorkspacePermission(request, {
    calendar: ["read"],
  });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const userId = session.user.id;

  try {
    const raw = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = listCalendarEventsQuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos", code: "INVALID_QUERY" },
        { status: 400 },
      );
    }

    const { from, to, visibility } = parsed.data;
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const personalClause = {
      visibility: "personal" as const,
      userId,
    };
    const workspaceClause = {
      visibility: "workspace" as const,
      workspaceId,
      OR: [{ userId }, { assignees: { some: { userId } } }],
    };

    const visibilityOr =
      visibility === "personal"
        ? [personalClause]
        : visibility === "workspace"
          ? [workspaceClause]
          : [personalClause, workspaceClause];

    // Overlap: startAt <= to AND coalesce(endAt, startAt) >= from
    const events = await prisma.calendarEvent.findMany({
      where: {
        AND: [
          { OR: visibilityOr },
          { startAt: { lte: toDate } },
          {
            OR: [
              { endAt: { gte: fromDate } },
              { endAt: null, startAt: { gte: fromDate } },
            ],
          },
        ],
      },
      orderBy: { startAt: "asc" },
      include: calendarEventInclude,
    });

    return NextResponse.json({ data: events.map(serializeCalendarEvent) });
  } catch (error) {
    console.error("[GET /api/calendar/events]", error);
    return NextResponse.json(
      { error: "Falha ao listar eventos", code: "FAILED_TO_LIST_EVENTS" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireWorkspacePermission(request, {
    calendar: ["create"],
  });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const userId = session.user.id;

  try {
    const parsed = createCalendarEventSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", code: "INVALID_EVENT_DATA" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const assignees = await resolveAssigneeIds({
      visibility: data.visibility,
      workspaceId,
      assigneeIds: data.assigneeIds,
    });
    if (!assignees.ok) return assignees.error;

    const event = await prisma.calendarEvent.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        startAt: new Date(data.startAt),
        endAt: data.endAt ? new Date(data.endAt) : null,
        allDay: data.allDay,
        remindAt: data.remindAt ? new Date(data.remindAt) : null,
        visibility: data.visibility,
        color: data.color ?? null,
        imageUrl: data.imageUrl ?? null,
        userId,
        workspaceId: data.visibility === "workspace" ? workspaceId : null,
        assignees:
          assignees.ids.length > 0
            ? { create: assignees.ids.map((id) => ({ userId: id })) }
            : undefined,
      },
      include: calendarEventInclude,
    });

    return NextResponse.json(
      { message: "Evento criado", data: serializeCalendarEvent(event) },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/calendar/events]", error);
    return NextResponse.json(
      { error: "Falha ao criar evento", code: "FAILED_TO_CREATE_EVENT" },
      { status: 500 },
    );
  }
}
