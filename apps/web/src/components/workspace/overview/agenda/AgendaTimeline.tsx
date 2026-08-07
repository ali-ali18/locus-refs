"use client";

import { useEffect, useRef } from "react";
import {
  format,
  formatHour,
  HOUR_START,
} from "@/components/calendar/calendar-utils";
import type { CalendarEvent } from "@/types/calendar-event.type";
import {
  DAY_HOURS,
  DAY_WIDTH,
  HOUR_COL_PX,
  LANE_GAP,
  LANE_H,
} from "./agenda-constants";
import { layoutHorizontal } from "./agenda-layout";
import { AgendaMeetingCard } from "./AgendaMeetingCard";
import { useAgendaNowMarker } from "./useAgendaNowMarker";

export function AgendaTimeline({
  events,
  onSelect,
}: {
  events: CalendarEvent[];
  onSelect: (event: CalendarEvent) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { nowLeft } = useAgendaNowMarker();
  const positions = layoutHorizontal(events);
  const laneCount = Math.max(
    positions.length ? Math.max(...positions.map((p) => p.lane)) + 1 : 1,
    1,
  );
  const boardHeight = laneCount * LANE_H + (laneCount - 1) * LANE_GAP;

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const d = new Date();
    const minutes = (d.getHours() - HOUR_START) * 60 + d.getMinutes();
    root.scrollLeft = Math.max(0, (minutes / 60) * HOUR_COL_PX - 140);
  }, []);

  return (
    <div
      ref={scrollerRef}
      className="-mx-1 max-w-full min-w-0 overflow-x-auto px-1 pb-1 scrollbar-none"
    >
      <div style={{ width: DAY_WIDTH }} className="flex flex-col gap-2">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${DAY_HOURS.length}, ${HOUR_COL_PX}px)`,
          }}
        >
          {DAY_HOURS.map((hour) => (
            <span
              key={hour}
              className="text-[11px] tabular-nums text-surface-contrast-muted"
            >
              {formatHour(hour)}
            </span>
          ))}
        </div>

        <div className="relative" style={{ height: boardHeight }}>
          {DAY_HOURS.map((hour, index) => (
            <div
              key={hour}
              className="pointer-events-none absolute inset-y-0 border-l border-dashed border-surface-contrast-foreground/15"
              style={{ left: index * HOUR_COL_PX }}
            />
          ))}

          <div
            className="pointer-events-none absolute inset-y-0 z-10 w-px bg-primary"
            style={{ left: nowLeft }}
            title={format(new Date(), "HH:mm")}
          />

          {positions.map(({ event, left, width, lane }) => (
            <AgendaMeetingCard
              key={event.id}
              event={event}
              onClick={() => onSelect(event)}
              style={{
                left,
                width,
                top: lane * (LANE_H + LANE_GAP),
                height: LANE_H,
              }}
            />
          ))}

          {events.length === 0 ? (
            <p className="absolute inset-x-0 top-3 pl-1 text-sm text-surface-contrast-muted">
              Nenhum evento hoje. Aproveite o foco.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
