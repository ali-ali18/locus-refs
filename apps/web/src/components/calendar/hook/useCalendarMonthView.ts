"use client";

import { isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "@/types/calendar-event.type";
import {
  chunkWeeks,
  eventsForDay,
  format,
  isSameMonth,
  startOfDay,
  WEEKDAY_LABELS_NARROW,
  WEEKDAY_LABELS_SHORT,
} from "../calendar-utils";

const MAX_DOTS = 3;
const MAX_CHIPS = 3;

function defaultSelectedDay(month: Date) {
  const today = startOfDay(new Date());
  return isSameMonth(today, month) ? today : startOfDay(month);
}

export function useCalendarMonthView({
  month,
  days,
  events,
  compact,
}: {
  month: Date;
  days: Date[];
  events: CalendarEvent[];
  compact: boolean;
}) {
  const weekLabels = compact ? WEEKDAY_LABELS_NARROW : WEEKDAY_LABELS_SHORT;
  const weeks = useMemo(() => chunkWeeks(days), [days]);

  const [selectedDay, setSelectedDay] = useState(() =>
    defaultSelectedDay(month),
  );

  useEffect(() => {
    setSelectedDay((prev) => {
      if (isSameMonth(prev, month)) return prev;
      return defaultSelectedDay(month);
    });
  }, [month]);

  const selectedEvents = useMemo(
    () => eventsForDay(events, selectedDay),
    [events, selectedDay],
  );

  const selectedDayLabel = format(selectedDay, "EEEE, d MMM", {
    locale: ptBR,
  });

  const selectDay = (day: Date) => setSelectedDay(startOfDay(day));

  return {
    weekLabels,
    weeks,
    selectedDay,
    selectedEvents,
    selectedDayLabel,
    selectDay,
    maxDots: MAX_DOTS,
    maxChips: MAX_CHIPS,
    isSameDay,
  };
}
