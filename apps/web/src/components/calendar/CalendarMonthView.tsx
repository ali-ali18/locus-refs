"use client";

import type { MouseEvent } from "react";
import type { CalendarEvent } from "@/types/calendar-event.type";
import { CalendarMonthCompact } from "./CalendarMonthCompact";
import { CalendarMonthDesktop } from "./CalendarMonthDesktop";
import { useCalendarMonthView } from "./hook/useCalendarMonthView";

interface Props {
  month: Date;
  days: Date[];
  events: CalendarEvent[];
  compact?: boolean;
  onDayClick: (day: Date, e: MouseEvent) => void;
  onEventClick: (event: CalendarEvent, e: MouseEvent) => void;
}

export function CalendarMonthView({
  month,
  days,
  events,
  compact = false,
  onDayClick,
  onEventClick,
}: Props) {
  const monthView = useCalendarMonthView({ month, days, events, compact });

  if (compact) {
    return (
      <CalendarMonthCompact
        month={month}
        days={days}
        events={events}
        weeks={monthView.weeks}
        weekLabels={monthView.weekLabels}
        selectedDay={monthView.selectedDay}
        selectedEvents={monthView.selectedEvents}
        selectedDayLabel={monthView.selectedDayLabel}
        maxDots={monthView.maxDots}
        isSameDay={monthView.isSameDay}
        onSelectDay={monthView.selectDay}
        onDayClick={onDayClick}
        onEventClick={onEventClick}
      />
    );
  }

  return (
    <CalendarMonthDesktop
      month={month}
      events={events}
      weeks={monthView.weeks}
      maxChips={monthView.maxChips}
      onDayClick={onDayClick}
      onEventClick={onEventClick}
    />
  );
}
