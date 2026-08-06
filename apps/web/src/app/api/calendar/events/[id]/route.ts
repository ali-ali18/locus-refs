import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  calendarEventInclude,
  resolveAssigneeIds,
  serializeCalendarEvent,
} from "@/server/calendar-event";
import {
  isWorkspaceAdmin,
  requireWorkspaceAccess,
} from "@/server/requireSession";
import { updateCalendarEventSchema } from "@/types/schema/calendar-event.schema";

function canManageEvent(
  event: { userId: string; visibility: string; workspaceId: string | null },
  userId: string,
  workspaceId: string,
  memberRole: string,
): boolean {
  if (event.userId === userId) return true;
  return (
    event.visibility === "workspace" &&
    event.workspaceId === workspaceId &&
    isWorkspaceAdmin(memberRole)
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId, memberRole } = auth;
  const userId = session.user.id;
  const { id } = await params;

  try {
    const parsed = updateCalendarEventSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", code: "INVALID_BODY" },
        { status: 400 },
      );
    }

    const existing = await prisma.calendarEvent.findFirst({ where: { id } });
    if (
      !existing ||
      !canManageEvent(existing, userId, workspaceId, memberRole)
    ) {
      return NextResponse.json(
        { error: "Evento não encontrado", code: "EVENT_NOT_FOUND" },
        { status: 404 },
      );
    }

    if (existing.visibility === "personal" && existing.userId !== userId) {
      return NextResponse.json(
        { error: "Evento não encontrado", code: "EVENT_NOT_FOUND" },
        { status: 404 },
      );
    }

    const visibility = parsed.data.visibility ?? existing.visibility;
    if (
      existing.userId !== userId &&
      (visibility === "personal" || existing.visibility === "personal")
    ) {
      return NextResponse.json(
        { error: "Evento não encontrado", code: "EVENT_NOT_FOUND" },
        { status: 404 },
      );
    }

    const data = parsed.data;
    const shouldSyncAssignees =
      data.assigneeIds !== undefined || data.visibility !== undefined;
    let assigneeIds: string[] | undefined;
    if (shouldSyncAssignees) {
      let nextAssigneeIds = data.assigneeIds;
      if (visibility === "personal") {
        nextAssigneeIds = [];
      } else if (nextAssigneeIds === undefined) {
        nextAssigneeIds = (
          await prisma.calendarEventAssignee.findMany({
            where: { eventId: id },
            select: { userId: true },
          })
        ).map((a) => a.userId);
      }
      const resolved = await resolveAssigneeIds({
        visibility,
        workspaceId,
        assigneeIds: nextAssigneeIds,
      });
      if (!resolved.ok) return resolved.error;
      assigneeIds = resolved.ids;
    }

    const event = await prisma.calendarEvent.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.startAt !== undefined
          ? { startAt: new Date(data.startAt) }
          : {}),
        ...(data.endAt !== undefined
          ? { endAt: data.endAt ? new Date(data.endAt) : null }
          : {}),
        ...(data.allDay !== undefined ? { allDay: data.allDay } : {}),
        ...(data.remindAt !== undefined
          ? { remindAt: data.remindAt ? new Date(data.remindAt) : null }
          : {}),
        ...(data.color !== undefined ? { color: data.color } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
        visibility,
        workspaceId: visibility === "workspace" ? workspaceId : null,
        ...(assigneeIds !== undefined
          ? {
              assignees: {
                deleteMany: {},
                create: assigneeIds.map((assigneeUserId) => ({
                  userId: assigneeUserId,
                })),
              },
            }
          : {}),
      },
      include: calendarEventInclude,
    });

    return NextResponse.json({
      message: "Evento atualizado",
      data: serializeCalendarEvent(event),
    });
  } catch (error) {
    console.error("[PATCH /api/calendar/events/:id]", error);
    return NextResponse.json(
      { error: "Falha ao atualizar evento", code: "FAILED_TO_UPDATE_EVENT" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId, memberRole } = auth;
  const userId = session.user.id;
  const { id } = await params;

  try {
    const existing = await prisma.calendarEvent.findFirst({ where: { id } });
    if (
      !existing ||
      !canManageEvent(existing, userId, workspaceId, memberRole)
    ) {
      return NextResponse.json(
        { error: "Evento não encontrado", code: "EVENT_NOT_FOUND" },
        { status: 404 },
      );
    }

    if (existing.visibility === "personal" && existing.userId !== userId) {
      return NextResponse.json(
        { error: "Evento não encontrado", code: "EVENT_NOT_FOUND" },
        { status: 404 },
      );
    }

    await prisma.calendarEvent.delete({ where: { id } });
    return NextResponse.json({ message: "Evento excluído" });
  } catch (error) {
    console.error("[DELETE /api/calendar/events/:id]", error);
    return NextResponse.json(
      { error: "Falha ao excluir evento", code: "FAILED_TO_DELETE_EVENT" },
      { status: 500 },
    );
  }
}
