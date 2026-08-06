import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isSaturday,
  isSunday,
  isToday,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CalendarEvent } from "@/types/calendar-event.type";

export const HOUR_START = 0;
export const HOUR_END = 23;
export const HOUR_PX = 96;
export const HOUR_PX_MOBILE = 72;
export const MIN_EVENT_MINUTES = 40;
export const HOUR_MARK_STEP = 2;
export const GRID_COLS = "4.5rem repeat(7, minmax(0, 1fr))";

export function gridTemplateColumns(dayCount: number): string {
  const gutter = dayCount === 1 ? "3.25rem" : "4.5rem";
  return `${gutter} repeat(${dayCount}, minmax(0, 1fr))`;
}

export function isHourMark(hour: number): boolean {
  return (hour - HOUR_START) % HOUR_MARK_STEP === 0;
}

export type CalendarViewMode = "day" | "week" | "month";

export function getDayDays(anchor: Date): Date[] {
  return [startOfDay(anchor)];
}

export function getDayRangeIso(anchor: Date): { from: string; to: string } {
  return {
    from: startOfDay(anchor).toISOString(),
    to: endOfDay(anchor).toISOString(),
  };
}

export function getWeekDays(anchor: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(anchor, { weekStartsOn: 0 }),
    end: endOfWeek(anchor, { weekStartsOn: 0 }),
  });
}

export function getWeekRangeIso(anchor: Date): { from: string; to: string } {
  const start = startOfWeek(anchor, { weekStartsOn: 0 });
  const end = endOfWeek(anchor, { weekStartsOn: 0 });
  return {
    from: startOfDay(start).toISOString(),
    to: endOfDay(end).toISOString(),
  };
}

/** Grade do mês (dom→sáb), incluindo dias do mês anterior/seguinte. */
export function getMonthGridDays(anchor: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(anchor), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(anchor), { weekStartsOn: 0 }),
  });
}

export function getMonthRangeIso(anchor: Date): { from: string; to: string } {
  const days = getMonthGridDays(anchor);
  return {
    from: startOfDay(days[0]).toISOString(),
    to: endOfDay(days[days.length - 1]).toISOString(),
  };
}

export const WEEKDAY_LABELS_SHORT = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
] as const;

export const WEEKDAY_LABELS_NARROW = [
  "D",
  "S",
  "T",
  "Q",
  "Q",
  "S",
  "S",
] as const;

export function shiftDay(anchor: Date, delta: number): Date {
  return addDays(anchor, delta);
}

export function shiftWeek(anchor: Date, delta: number): Date {
  return addWeeks(anchor, delta);
}

export function shiftMonth(anchor: Date, delta: number): Date {
  return addMonths(anchor, delta);
}

export function formatDayLabel(anchor: Date): string {
  return format(anchor, "EEE, d MMM yyyy", { locale: ptBR });
}

export function formatWeekLabel(anchor: Date): string {
  const days = getWeekDays(anchor);
  const first = days[0];
  const last = days[days.length - 1];
  if (first.getMonth() === last.getMonth()) {
    return format(first, "MMMM yyyy", { locale: ptBR });
  }
  return `${format(first, "MMM", { locale: ptBR })} – ${format(last, "MMM yyyy", { locale: ptBR })}`;
}

export function formatMonthLabel(anchor: Date): string {
  return format(anchor, "MMMM yyyy", { locale: ptBR });
}

export function hoursOfDay(): number[] {
  return Array.from(
    { length: HOUR_END - HOUR_START + 1 },
    (_, i) => HOUR_START + i,
  );
}

export function formatHour(hour: number): string {
  return format(setMinutes(setHours(new Date(), hour), 0), "HH:mm");
}

/** Ex.: "GMT -03" */
export function formatGmtOffset(date = new Date()): string {
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (m === 0) return `GMT ${sign}${String(h).padStart(2, "0")}`;
  return `GMT ${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function isWeekend(day: Date): boolean {
  return isSaturday(day) || isSunday(day);
}

export function eventEnd(event: CalendarEvent): Date {
  return event.endAt ? new Date(event.endAt) : new Date(event.startAt);
}

export function allDayEventsForDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events.filter((event) => {
    if (!event.allDay) return false;
    const start = startOfDay(new Date(event.startAt));
    const end = startOfDay(eventEnd(event));
    const d = startOfDay(day);
    return d >= start && d <= end;
  });
}

export function timedEventsForDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events.filter((event) => {
    if (event.allDay) return false;
    const start = new Date(event.startAt);
    const end = eventEnd(event);
    return (
      isSameDay(start, day) ||
      isSameDay(end, day) ||
      (start < startOfDay(day) && end > endOfDay(day))
    );
  });
}

/** Eventos com horário que cruzam a faixa [hour, hour+1) no dia. */
export function eventsOverlappingHour(
  events: CalendarEvent[],
  day: Date,
  hour: number,
): CalendarEvent[] {
  const slotStart = slotStartAt(day, hour);
  const slotEnd = slotEndAt(day, hour);
  return timedEventsForDay(events, day)
    .filter((event) => {
      const start = new Date(event.startAt);
      const end = eventEnd(event);
      return start < slotEnd && end > slotStart;
    })
    .sort(
      (a, b) =>
        new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    );
}

export function eventsForDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return [
    ...allDayEventsForDay(events, day),
    ...timedEventsForDay(events, day),
  ].sort(
    (a, b) =>
      Number(b.allDay) - Number(a.allDay) ||
      new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );
}

export type EventPosition = {
  event: CalendarEvent;
  top: number;
  height: number;
  column: number;
  columns: number;
};

/** Layout vertical + colunas para overlaps no mesmo dia. */
export function layoutTimedEvents(
  events: CalendarEvent[],
  day: Date,
  hourPx: number = HOUR_PX,
): EventPosition[] {
  const dayStart = setSeconds(
    setMinutes(setHours(startOfDay(day), HOUR_START), 0),
    0,
  );
  const dayEnd = setSeconds(
    setMinutes(setHours(startOfDay(day), HOUR_END + 1), 0),
    0,
  );

  const items = timedEventsForDay(events, day)
    .map((event) => {
      let start = new Date(event.startAt);
      let end = eventEnd(event);
      if (end <= start) end = new Date(start.getTime() + MIN_EVENT_MINUTES * 60 * 1000);
      if (end.getTime() - start.getTime() < MIN_EVENT_MINUTES * 60 * 1000) {
        end = new Date(start.getTime() + MIN_EVENT_MINUTES * 60 * 1000);
      }
      if (start < dayStart) start = dayStart;
      if (end > dayEnd) end = dayEnd;

      const minutesFromStart =
        (start.getTime() - dayStart.getTime()) / (60 * 1000);
      const durationMinutes = Math.max(
        MIN_EVENT_MINUTES,
        (end.getTime() - start.getTime()) / (60 * 1000),
      );

      return {
        event,
        startMs: start.getTime(),
        endMs: end.getTime(),
        top: (minutesFromStart / 60) * hourPx,
        height: (durationMinutes / 60) * hourPx,
      };
    })
    .sort((a, b) => a.startMs - b.startMs || b.endMs - a.endMs);

  const columnEnds: number[] = [];
  const assigned: { item: (typeof items)[number]; column: number }[] = [];

  for (const item of items) {
    let column = columnEnds.findIndex((end) => end <= item.startMs);
    if (column === -1) {
      column = columnEnds.length;
      columnEnds.push(item.endMs);
    } else {
      columnEnds[column] = item.endMs;
    }
    assigned.push({ item, column });
  }

  return assigned.map(({ item, column }) => {
    const overlapping = assigned.filter(
      ({ item: other }) =>
        other.startMs < item.endMs && other.endMs > item.startMs,
    );
    const columns = Math.max(
      1,
      ...overlapping.map((o) => o.column + 1),
      column + 1,
    );
    return {
      event: item.event,
      top: item.top,
      height: item.height,
      column,
      columns,
    };
  });
}

export function slotStartAt(day: Date, hour: number): Date {
  return setSeconds(setMinutes(setHours(startOfDay(day), hour), 0), 0);
}

export function slotEndAt(day: Date, hour: number): Date {
  return setSeconds(setMinutes(setHours(startOfDay(day), hour + 1), 0), 0);
}

export function dayHeaderParts(day: Date): { weekday: string; date: string } {
  const weekday = format(day, "EEEE", { locale: ptBR });
  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    date: format(day, "d"),
  };
}

const LEGACY_EVENT_COLORS: Record<string, string> = {
  personal: "#e8bc3a",
  workspace: "#6b95e8",
  fresh: "#4fc48f",
  warm: "#e87a72",
  accent: "#a890f0",
};

const DEFAULT_EVENT_COLOR = "#6b95e8";

function resolveEventHex(color: string | null | undefined): string {
  if (!color) return DEFAULT_EVENT_COLOR;
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
  return LEGACY_EVENT_COLORS[color] ?? DEFAULT_EVENT_COLOR;
}

/** Mesma cor do picker — sem misturar com --card (suja o tom). */
export function eventPastelColor(event: CalendarEvent): string {
  return resolveEventHex(event.color);
}

export function eventAccentClass(_event: CalendarEvent): string {
  return "bg-primary";
}

export { resolveEventHex, DEFAULT_EVENT_COLOR };

export { isToday, isSameMonth, format, startOfDay };

export type CalendarVisibilityFilter = "all" | "personal" | "workspace";

export const VIEW_LABELS: Record<CalendarViewMode, string> = {
  day: "Dia",
  week: "Semana",
  month: "Mês",
};

export const PRESET_EVENT_COLORS = [
  "#6b95e8",
  "#4fc48f",
  "#e8bc3a",
  "#e87a72",
  "#a890f0",
  "#45c4b4",
  "#e89555",
  "#d98ae0",
] as const;

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function eventPeople(event: CalendarEvent) {
  const fromAssignees = (event.assignees ?? []).map((a) => a.user);
  if (fromAssignees.length > 0) return fromAssignees;
  return event.user ? [event.user] : [];
}

export function eventChipLabel(event: CalendarEvent): string {
  if (event.allDay) return event.title;
  const time = format(new Date(event.startAt), "HH:mm");
  return `${time} ${event.title}`;
}

export function eventTimeLine(event: CalendarEvent): string {
  if (event.allDay) return "Dia inteiro";
  const start = new Date(event.startAt);
  const end = event.endAt ? new Date(event.endAt) : null;
  if (!end) return format(start, "HH:mm");
  return `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`;
}

export function eventUpcomingTimeLabel(event: CalendarEvent): string {
  if (event.allDay) {
    return `${format(new Date(event.startAt), "d MMM")} · Dia inteiro`;
  }
  const start = new Date(event.startAt);
  const end = event.endAt ? new Date(event.endAt) : null;
  const day = format(start, "d MMM");
  const range = end
    ? `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`
    : format(start, "HH:mm");
  return `${day} · ${range}`;
}

export function chunkWeeks(days: Date[]): Date[][] {
  const rows: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }
  return rows;
}

export function mergeDateAndTime(day: Date, timeHHmm: string): Date {
  const [h, m] = timeHHmm.split(":").map(Number);
  return setMinutes(setHours(new Date(day), h || 0), m || 0);
}

/** Aceita HH:mm ou HH:mm:ss do input nativo. */
export function normalizeTime(value: string): string {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

export function timeToMinutes(timeHHmm: string): number {
  const [h, m] = timeHHmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function addOneHour(timeHHmm: string): string {
  const [h, m] = timeHHmm.split(":").map(Number);
  const next = ((h || 0) + 1) % 24;
  return `${String(next).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
}

export function toTimeValue(iso: string | Date): string {
  return format(typeof iso === "string" ? new Date(iso) : iso, "HH:mm");
}

export function toDateValue(iso: string | Date): string {
  return format(typeof iso === "string" ? new Date(iso) : iso, "yyyy-MM-dd");
}
