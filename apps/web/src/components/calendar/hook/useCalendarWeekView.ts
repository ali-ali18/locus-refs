"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CalendarEvent } from "@/types/calendar-event.type";
import {
  allDayEventsForDay,
  format,
  formatGmtOffset,
  gridTemplateColumns,
  HOUR_END,
  HOUR_PX,
  HOUR_START,
  hoursOfDay,
  isToday,
} from "../calendar-utils";

function nowMarker(days: Date[], hourPx: number) {
  const d = new Date();
  if (!days.some((day) => isToday(day))) return null;
  const minutes = (d.getHours() - HOUR_START) * 60 + d.getMinutes();
  if (minutes < 0 || minutes > (HOUR_END - HOUR_START + 1) * 60) return null;
  return { top: (minutes / 60) * hourPx, label: format(d, "HH:mm") };
}

export function useCalendarWeekView({
  days,
  events,
  hourPx = HOUR_PX,
}: {
  days: Date[];
  events: CalendarEvent[];
  hourPx?: number;
}) {
  const hours = useMemo(() => hoursOfDay(), []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridHeight = (HOUR_END - HOUR_START + 1) * hourPx;
  const cols = gridTemplateColumns(days.length);
  const gmt = useMemo(() => formatGmtOffset(), []);
  const [now, setNow] = useState(() => nowMarker(days, hourPx));

  const hasAllDay = useMemo(
    () => days.some((day) => allDayEventsForDay(events, day).length > 0),
    [days, events],
  );

  useEffect(() => {
    setNow(nowMarker(days, hourPx));

    const msUntilNextMinute = 60_000 - (Date.now() % 60_000);
    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      setNow(nowMarker(days, hourPx));
      intervalId = window.setInterval(() => {
        setNow(nowMarker(days, hourPx));
      }, 60_000);
    }, msUntilNextMinute);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId != null) window.clearInterval(intervalId);
    };
  }, [days, hourPx]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const d = new Date();
    const minutes = (d.getHours() - HOUR_START) * 60 + d.getMinutes();
    root.scrollTop = Math.max(0, (minutes / 60) * hourPx - 140);
  }, [hourPx]);

  return {
    hours,
    scrollRef,
    gridHeight,
    cols,
    gmt,
    hasAllDay,
    now,
  };
}
