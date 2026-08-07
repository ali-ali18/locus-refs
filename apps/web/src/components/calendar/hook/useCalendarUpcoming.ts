"use client";

import { useMemo } from "react";
import type { CalendarEvent } from "@/types/calendar-event.type";

export function useCalendarUpcoming(events: CalendarEvent[]) {
  return useMemo(() => {
    const sorted = [...events].sort(
      (a, b) =>
        new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    );
    return {
      personal: sorted.filter((e) => e.visibility === "personal"),
      workspace: sorted.filter((e) => e.visibility === "workspace"),
    };
  }, [events]);
}
