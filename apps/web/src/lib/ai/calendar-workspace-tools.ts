import { tool } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";
import {
  calendarEventInclude,
  resolveAssigneeIds,
  serializeCalendarEvent,
} from "@/server/calendar-event";
import { canInWorkspace } from "@/server/permissions";

const isoDateTime = z
  .string()
  .min(1)
  .describe(
    "ISO 8601 datetime. Prefira com offset local (ex: 2026-08-06T15:00:00-03:00).",
  );

const colorSchema = z
  .string()
  .trim()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida (#RRGGBB)")
  .nullable()
  .optional();

async function canManageEvent(
  event: { userId: string; visibility: string; workspaceId: string | null },
  userId: string,
  workspaceId: string,
): Promise<boolean> {
  if (event.userId === userId) return true;
  if (event.visibility !== "workspace" || event.workspaceId !== workspaceId) {
    return false;
  }
  return canInWorkspace(workspaceId, userId, {
    calendar: ["manageWorkspace"],
  });
}

function canViewEvent(
  event: {
    userId: string;
    visibility: string;
    workspaceId: string | null;
    assignees?: { userId: string }[];
  },
  userId: string,
  workspaceId: string,
): boolean {
  if (event.visibility === "personal") {
    return event.userId === userId;
  }
  if (event.workspaceId !== workspaceId) return false;
  if (event.userId === userId) return true;
  return (event.assignees ?? []).some((a) => a.userId === userId);
}

function summarizeEvent(
  event: {
    id: string;
    title: string;
    description: string | null;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
    visibility: string;
    color: string | null;
    assignees?: { user: { id: string; name: string } }[];
    user?: { id: string; name: string } | null;
  },
) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    startAt: event.startAt,
    endAt: event.endAt,
    allDay: event.allDay,
    visibility: event.visibility,
    color: event.color,
    createdBy: event.user
      ? { id: event.user.id, name: event.user.name }
      : null,
    assignees: (event.assignees ?? []).map((a) => ({
      id: a.user.id,
      name: a.user.name,
    })),
  };
}

async function resolveAssigneesForTool(opts: {
  visibility: "personal" | "workspace";
  workspaceId: string;
  assigneeIds: string[] | undefined;
}): Promise<{ ok: true; ids: string[] } | { ok: false; error: string }> {
  const resolved = await resolveAssigneeIds(opts);
  if (!resolved.ok) {
    return {
      ok: false,
      error: "Um ou mais assignees não são membros do workspace.",
    };
  }
  return { ok: true, ids: resolved.ids };
}

export function createCalendarWorkspaceTools(params: {
  workspaceId: string;
  userId: string;
}) {
  const { workspaceId, userId } = params;

  return {
    listCalendarEvents: tool({
      description:
        "Lista eventos do calendário no intervalo [from, to]. Respeita ACL: pessoais do usuário + workspace em que é criador ou assignee. Use para agenda do dia/semana/mês.",
      inputSchema: z.object({
        from: isoDateTime.describe("Início do intervalo (ISO)"),
        to: isoDateTime.describe("Fim do intervalo (ISO)"),
        visibility: z
          .enum(["personal", "workspace", "all"])
          .optional()
          .default("all")
          .describe("Filtro de visibilidade"),
      }),
      execute: async ({ from, to, visibility }) => {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
          return { error: "from/to inválidos. Use ISO 8601." };
        }
        if (toDate < fromDate) {
          return { error: "to deve ser >= from." };
        }

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
          take: 100,
        });

        const items = events.map((e) =>
          summarizeEvent(serializeCalendarEvent(e)),
        );
        return {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
          visibility,
          count: items.length,
          events: items,
        };
      },
    }),

    getCalendarEvent: tool({
      description:
        "Busca um evento do calendário por id (se o usuário puder vê-lo).",
      inputSchema: z.object({
        eventId: z.string().min(1),
      }),
      execute: async ({ eventId }) => {
        const event = await prisma.calendarEvent.findFirst({
          where: { id: eventId },
          include: calendarEventInclude,
        });
        if (!event || !canViewEvent(event, userId, workspaceId)) {
          return { error: "Evento não encontrado." };
        }
        return {
          event: summarizeEvent(serializeCalendarEvent(event)),
        };
      },
    }),

    createCalendarEvent: tool({
      description:
        "Cria um evento no calendário. visibility=personal (só o usuário) ou workspace (criador + assignees). Horários em ISO com offset local.",
      inputSchema: z.object({
        title: z.string().trim().min(1).max(200),
        description: z.string().trim().max(2000).nullable().optional(),
        startAt: isoDateTime,
        endAt: isoDateTime.nullable().optional(),
        allDay: z.boolean().optional().default(false),
        visibility: z
          .enum(["personal", "workspace"])
          .optional()
          .default("personal"),
        color: colorSchema,
        assigneeIds: z
          .array(z.string().min(1))
          .optional()
          .default([])
          .describe("Só para visibility=workspace"),
      }),
      execute: async ({
        title,
        description,
        startAt,
        endAt,
        allDay,
        visibility,
        color,
        assigneeIds,
      }) => {
        const start = new Date(startAt);
        if (Number.isNaN(start.getTime())) {
          return { error: "startAt inválido." };
        }
        const end = endAt ? new Date(endAt) : null;
        if (endAt && (!end || Number.isNaN(end.getTime()))) {
          return { error: "endAt inválido." };
        }
        if (end && end.getTime() < start.getTime()) {
          return { error: "endAt deve ser >= startAt." };
        }

        const assignees = await resolveAssigneesForTool({
          visibility,
          workspaceId,
          assigneeIds,
        });
        if (!assignees.ok) return assignees;

        const event = await prisma.calendarEvent.create({
          data: {
            title,
            description: description ?? null,
            startAt: start,
            endAt: end,
            allDay: allDay ?? false,
            visibility,
            color: color ?? null,
            userId,
            workspaceId: visibility === "workspace" ? workspaceId : null,
            assignees:
              assignees.ids.length > 0
                ? { create: assignees.ids.map((id) => ({ userId: id })) }
                : undefined,
          },
          include: calendarEventInclude,
        });

        return {
          created: true,
          event: summarizeEvent(serializeCalendarEvent(event)),
          message: `Evento "${event.title}" criado (${visibility}).`,
        };
      },
    }),

    updateCalendarEvent: tool({
      description:
        "Atualiza um evento do calendário. Só o criador (ou admin em eventos workspace). Informe apenas os campos a mudar.",
      inputSchema: z.object({
        eventId: z.string().min(1),
        title: z.string().trim().min(1).max(200).optional(),
        description: z.string().trim().max(2000).nullable().optional(),
        startAt: isoDateTime.optional(),
        endAt: isoDateTime.nullable().optional(),
        allDay: z.boolean().optional(),
        visibility: z.enum(["personal", "workspace"]).optional(),
        color: colorSchema,
        assigneeIds: z.array(z.string().min(1)).optional(),
      }),
      execute: async ({
        eventId,
        title,
        description,
        startAt,
        endAt,
        allDay,
        visibility: nextVisibility,
        color,
        assigneeIds,
      }) => {
        const member = await prisma.member.findFirst({
          where: { organizationId: workspaceId, userId },
          select: { role: true },
        });
        if (!member) {
          return { error: "Sem acesso a este workspace." };
        }

        const existing = await prisma.calendarEvent.findFirst({
          where: { id: eventId },
        });
        if (
          !existing ||
          !(await canManageEvent(existing, userId, workspaceId))
        ) {
          return { error: "Evento não encontrado." };
        }

        const visibility = nextVisibility ?? existing.visibility;
        if (
          existing.userId !== userId &&
          (visibility === "personal" || existing.visibility === "personal")
        ) {
          return { error: "Evento não encontrado." };
        }

        let nextStart = existing.startAt;
        let nextEnd = existing.endAt;
        if (startAt !== undefined) {
          nextStart = new Date(startAt);
          if (Number.isNaN(nextStart.getTime())) {
            return { error: "startAt inválido." };
          }
        }
        if (endAt !== undefined) {
          nextEnd = endAt ? new Date(endAt) : null;
          if (endAt && (!nextEnd || Number.isNaN(nextEnd.getTime()))) {
            return { error: "endAt inválido." };
          }
        }
        if (nextEnd && nextEnd.getTime() < nextStart.getTime()) {
          return { error: "endAt deve ser >= startAt." };
        }

        const shouldSyncAssignees =
          assigneeIds !== undefined || nextVisibility !== undefined;
        let resolvedAssigneeIds: string[] | undefined;
        if (shouldSyncAssignees) {
          let nextAssigneeIds = assigneeIds;
          if (visibility === "personal") {
            nextAssigneeIds = [];
          } else if (nextAssigneeIds === undefined) {
            nextAssigneeIds = (
              await prisma.calendarEventAssignee.findMany({
                where: { eventId },
                select: { userId: true },
              })
            ).map((a) => a.userId);
          }
          const resolved = await resolveAssigneesForTool({
            visibility,
            workspaceId,
            assigneeIds: nextAssigneeIds,
          });
          if (!resolved.ok) return resolved;
          resolvedAssigneeIds = resolved.ids;
        }

        const event = await prisma.calendarEvent.update({
          where: { id: eventId },
          data: {
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(startAt !== undefined ? { startAt: nextStart } : {}),
            ...(endAt !== undefined ? { endAt: nextEnd } : {}),
            ...(allDay !== undefined ? { allDay } : {}),
            ...(color !== undefined ? { color } : {}),
            visibility,
            workspaceId: visibility === "workspace" ? workspaceId : null,
            ...(resolvedAssigneeIds !== undefined
              ? {
                  assignees: {
                    deleteMany: {},
                    create: resolvedAssigneeIds.map((id) => ({ userId: id })),
                  },
                }
              : {}),
          },
          include: calendarEventInclude,
        });

        return {
          updated: true,
          event: summarizeEvent(serializeCalendarEvent(event)),
          message: `Evento "${event.title}" atualizado.`,
        };
      },
    }),

    deleteCalendarEvent: tool({
      description:
        "Exclui um evento do calendário. Só o criador (ou admin em workspace). Pedido explícito; requer confirmação na UI.",
      inputSchema: z.object({
        eventId: z.string().min(1),
      }),
      needsApproval: true,
      execute: async ({ eventId }) => {
        const member = await prisma.member.findFirst({
          where: { organizationId: workspaceId, userId },
          select: { role: true },
        });
        if (!member) {
          return { error: "Sem acesso a este workspace." };
        }

        const existing = await prisma.calendarEvent.findFirst({
          where: { id: eventId },
          select: {
            id: true,
            title: true,
            userId: true,
            visibility: true,
            workspaceId: true,
          },
        });
        if (
          !existing ||
          !(await canManageEvent(existing, userId, workspaceId))
        ) {
          return { error: "Evento não encontrado." };
        }

        await prisma.calendarEvent.delete({ where: { id: eventId } });
        return {
          deleted: true,
          eventId: existing.id,
          title: existing.title,
          message: `Evento "${existing.title}" excluído.`,
        };
      },
    }),
  } as const;
}

export type CalendarWorkspaceToolName = keyof ReturnType<
  typeof createCalendarWorkspaceTools
>;
