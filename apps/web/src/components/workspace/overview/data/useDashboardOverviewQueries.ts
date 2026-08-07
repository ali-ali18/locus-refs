"use client";

import type { Board, Note, NotePins } from "@refstash/shared";
import { useMemo } from "react";
import { useBoards } from "@/hook/boards/useBoards";
import { useCalendarEvents } from "@/hook/calendar/useCalendarEvents";
import { useCollections } from "@/hook/collections/useCollections";
import { useKanbanBoards } from "@/hook/kanban/useKanbanBoards";
import type { KanbanBoardListItem } from "@/hook/kanban/useKanbanBoards";
import { useNotePins } from "@/hook/notes/useNotePins";
import { useNotes } from "@/hook/notes/useNotes";
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";
import type { CalendarEvent } from "@/types/calendar-event.type";

const DAY_MS = 24 * 60 * 60 * 1000;
const PULSE_DAYS = 35;
const UPCOMING_DAYS = 14;

export type WorkspaceMember = NonNullable<
  ReturnType<typeof useWorkspaceMembers>["allMembers"]
>[number];

export type CollectionItem = ReturnType<
  typeof useCollections
>["collections"][number];

export type DashboardOverviewData = {
  notes: Note[];
  collections: CollectionItem[];
  boards: Board[];
  kanbanBoards: KanbanBoardListItem[];
  events: CalendarEvent[];
  members: WorkspaceMember[];
  pins: NotePins | undefined;
};

export function useDashboardOverviewQueries() {
  const range = useMemo(() => {
    const now = new Date();
    const from = new Date(now.getTime() - (PULSE_DAYS - 1) * DAY_MS);
    from.setHours(0, 0, 0, 0);
    const to = new Date(now.getTime() + UPCOMING_DAYS * DAY_MS);
    to.setHours(23, 59, 59, 999);
    return { from: from.toISOString(), to: to.toISOString() };
  }, []);

  const notesQuery = useNotes();
  const collectionsQuery = useCollections();
  const boardsQuery = useBoards();
  const kanbanQuery = useKanbanBoards();
  const eventsQuery = useCalendarEvents(range);
  const membersQuery = useWorkspaceMembers();
  const pinsQuery = useNotePins();

  const isLoading =
    notesQuery.isLoading ||
    collectionsQuery.isLoading ||
    boardsQuery.isLoading ||
    kanbanQuery.isLoading ||
    eventsQuery.isLoading ||
    membersQuery.isLoading ||
    pinsQuery.isLoading;

  const data: DashboardOverviewData = {
    notes: notesQuery.data ?? [],
    collections: collectionsQuery.collections,
    boards: boardsQuery.data ?? [],
    kanbanBoards: kanbanQuery.data ?? [],
    events: eventsQuery.data ?? [],
    members: membersQuery.allMembers ?? [],
    pins: pinsQuery.data,
  };

  return { isLoading, data };
}
