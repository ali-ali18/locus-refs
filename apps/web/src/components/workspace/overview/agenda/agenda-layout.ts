import { eventEnd, HOUR_START } from "@/components/calendar/calendar-utils";
import type { CalendarEvent } from "@/types/calendar-event.type";
import {
  DAY_HOURS,
  DAY_WIDTH,
  HOUR_COL_PX,
  MIN_DURATION_MIN,
} from "./agenda-constants";

export type HorizontalPosition = {
  event: CalendarEvent;
  left: number;
  width: number;
  lane: number;
};

export function layoutHorizontal(
  events: CalendarEvent[],
): HorizontalPosition[] {
  const daySpanMin = DAY_HOURS.length * 60;

  const items = events
    .map((event) => {
      const start = new Date(event.startAt);
      let end = eventEnd(event);
      if (end <= start) {
        end = new Date(start.getTime() + MIN_DURATION_MIN * 60_000);
      }
      const startMin = start.getHours() * 60 + start.getMinutes();
      let endMin = end.getHours() * 60 + end.getMinutes();
      if (endMin <= startMin) endMin = startMin + MIN_DURATION_MIN;

      const durationMin = Math.max(MIN_DURATION_MIN, endMin - startMin);
      const left = (startMin / daySpanMin) * DAY_WIDTH;
      const width = Math.max(
        HOUR_COL_PX * 0.45,
        (durationMin / daySpanMin) * DAY_WIDTH,
      );

      return {
        event,
        startMs: start.getTime(),
        endMs: end.getTime(),
        left,
        width: Math.min(width, DAY_WIDTH - left),
      };
    })
    .sort((a, b) => a.startMs - b.startMs || b.endMs - a.endMs);

  const laneEnds: number[] = [];
  const placed: HorizontalPosition[] = [];

  for (const item of items) {
    let lane = laneEnds.findIndex((end) => end <= item.startMs);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(item.endMs);
    } else {
      laneEnds[lane] = item.endMs;
    }
    placed.push({
      event: item.event,
      left: item.left,
      width: item.width,
      lane,
    });
  }

  return placed;
}

export function nowMarkerLeft(date = new Date()): number {
  const minutes = (date.getHours() - HOUR_START) * 60 + date.getMinutes();
  return (minutes / 60) * HOUR_COL_PX;
}
