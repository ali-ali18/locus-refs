import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export const calendarEventInclude = {
  user: { select: { id: true, name: true, image: true } },
  assignees: {
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  },
} satisfies Prisma.CalendarEventInclude;

export function serializeCalendarEvent<
  T extends {
    startAt: Date;
    endAt: Date | null;
    remindAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  },
>(
  event: T,
): Omit<T, "startAt" | "endAt" | "remindAt" | "createdAt" | "updatedAt"> & {
  startAt: string;
  endAt: string | null;
  remindAt: string | null;
  createdAt: string;
  updatedAt: string;
} {
  return {
    ...event,
    startAt: event.startAt.toISOString(),
    endAt: event.endAt?.toISOString() ?? null,
    remindAt: event.remindAt?.toISOString() ?? null,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

/** Assignees só em eventos workspace; valida membros da org. */
export async function resolveAssigneeIds(opts: {
  visibility: "personal" | "workspace";
  workspaceId: string;
  assigneeIds: string[] | undefined;
}): Promise<{ ok: true; ids: string[] } | { ok: false; error: Response }> {
  if (opts.visibility !== "workspace") {
    return { ok: true, ids: [] };
  }

  const unique = [...new Set(opts.assigneeIds ?? [])];
  if (unique.length === 0) return { ok: true, ids: [] };

  const members = await prisma.member.findMany({
    where: {
      organizationId: opts.workspaceId,
      userId: { in: unique },
    },
    select: { userId: true },
  });

  if (members.length !== unique.length) {
    return {
      ok: false,
      error: Response.json(
        {
          error: "Um ou mais assignees não são membros do workspace",
          code: "INVALID_ASSIGNEES",
        },
        { status: 400 },
      ),
    };
  }

  return { ok: true, ids: unique };
}
