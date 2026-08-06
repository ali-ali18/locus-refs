"use client";

import { useMemo, useState, type MouseEvent } from "react";
import { useCalendarEvents } from "@/hook/calendar/useCalendarEvents";
import { useIsMobile } from "@/hook/use-mobile";
import type { CalendarEvent } from "@/types/calendar-event.type";
import {
  type CalendarViewMode,
  type CalendarVisibilityFilter,
  eventsOverlappingHour,
  formatDayLabel,
  formatMonthLabel,
  formatWeekLabel,
  getDayDays,
  getDayRangeIso,
  getMonthGridDays,
  getMonthRangeIso,
  getWeekDays,
  getWeekRangeIso,
  HOUR_PX,
  HOUR_PX_MOBILE,
  shiftDay,
  shiftMonth,
  shiftWeek,
  slotEndAt,
  slotStartAt,
  startOfDay,
} from "../calendar-utils";

export type CalendarSlotSheet = {
  day: Date;
  hour: number;
  events: CalendarEvent[];
};

export function useContentCalendar() {
  const isMobile = useIsMobile();
  const [anchor, setAnchor] = useState(() => new Date());
  const [visibility, setVisibility] = useState<CalendarVisibilityFilter>("all");
  const [viewMode, setViewMode] = useState<CalendarViewMode>(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? "day" : "week",
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [draftStart, setDraftStart] = useState<Date | undefined>();
  const [draftEnd, setDraftEnd] = useState<Date | undefined>();
  const [draftAllDay, setDraftAllDay] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [upcomingOpen, setUpcomingOpen] = useState(false);
  const [slotSheet, setSlotSheet] = useState<CalendarSlotSheet | null>(null);
  const [slotSheetOpen, setSlotSheetOpen] = useState(false);

  const effectiveMode: CalendarViewMode =
    isMobile && viewMode === "week"
      ? "day"
      : !isMobile && viewMode === "day"
        ? "week"
        : viewMode;

  const dayDays = useMemo(() => getDayDays(anchor), [anchor]);
  const weekDays = useMemo(() => getWeekDays(anchor), [anchor]);
  const monthDays = useMemo(() => getMonthGridDays(anchor), [anchor]);
  const range = useMemo(() => {
    if (effectiveMode === "day") return getDayRangeIso(anchor);
    if (effectiveMode === "week") return getWeekRangeIso(anchor);
    return getMonthRangeIso(anchor);
  }, [anchor, effectiveMode]);

  const { data: events = [], isLoading } = useCalendarEvents({
    from: range.from,
    to: range.to,
    visibility,
  });

  const titleLabel =
    effectiveMode === "day"
      ? formatDayLabel(anchor)
      : effectiveMode === "week"
        ? formatWeekLabel(anchor)
        : formatMonthLabel(anchor);

  const navLabel =
    effectiveMode === "day"
      ? "dia"
      : effectiveMode === "week"
        ? "semana"
        : "mês";

  const timedDays = effectiveMode === "day" ? dayDays : weekDays;
  const viewMenuValue =
    isMobile && effectiveMode === "day" ? "day" : effectiveMode;
  const hourPx = isMobile ? HOUR_PX_MOBILE : HOUR_PX;

  const shiftAnchor = (delta: number) => {
    setAnchor((d) => {
      if (effectiveMode === "day") return shiftDay(d, delta);
      if (effectiveMode === "week") return shiftWeek(d, delta);
      return shiftMonth(d, delta);
    });
  };

  const goToday = () => setAnchor(new Date());

  const openCreate = (opts?: {
    start?: Date;
    end?: Date;
    allDay?: boolean;
    clientX?: number;
    clientY?: number;
  }) => {
    setEditing(null);
    setDraftStart(opts?.start);
    setDraftEnd(opts?.end);
    setDraftAllDay(opts?.allDay ?? false);
    if (opts?.clientX != null && opts?.clientY != null) {
      setPopoverAnchor({ x: opts.clientX, y: opts.clientY });
    }
    setDialogOpen(true);
  };

  const openEdit = (event: CalendarEvent, e: MouseEvent) => {
    setEditing(event);
    setDraftStart(undefined);
    setDraftEnd(undefined);
    setDraftAllDay(false);
    setPopoverAnchor({ x: e.clientX, y: e.clientY });
    setDialogOpen(true);
  };

  const openCreateAllDay = (day: Date, e: MouseEvent) => {
    openCreate({
      start: startOfDay(day),
      end: startOfDay(day),
      allDay: true,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const openCreateSlot = (day: Date, hour: number, e: MouseEvent) => {
    openCreate({
      start: slotStartAt(day, hour),
      end: slotEndAt(day, hour),
      allDay: false,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const openSlotSheet = (day: Date, hour: number) => {
    const overlapping = eventsOverlappingHour(events, day, hour);
    setSlotSheet({ day, hour, events: overlapping });
    setSlotSheetOpen(true);
  };

  const handleSlotSheetOpenChange = (open: boolean) => {
    setSlotSheetOpen(open);
    // Mantém o conteúdo montado até a animação de saída terminar.
    if (!open) {
      window.setTimeout(() => setSlotSheet(null), 450);
    }
  };

  /** Slot vazio → cria; slot com eventos → drawer com lista + adicionar. */
  const handleWeekSlotClick = (day: Date, hour: number, e: MouseEvent) => {
    const overlapping = eventsOverlappingHour(events, day, hour);
    if (overlapping.length === 0) {
      openCreateSlot(day, hour, e);
      return;
    }
    openSlotSheet(day, hour);
  };

  /** Clique no card abre o drawer daquele horário (dá pra adicionar outra). */
  const handleWeekEventClick = (event: CalendarEvent, _e: MouseEvent) => {
    const start = new Date(event.startAt);
    openSlotSheet(startOfDay(start), start.getHours());
  };

  const handleSlotSheetEventClick = (event: CalendarEvent, e: MouseEvent) => {
    openEdit(event, e);
  };

  const handleSlotSheetAdd = (e: MouseEvent) => {
    if (!slotSheet) return;
    const { day, hour } = slotSheet;
    openCreateSlot(day, hour, e);
  };

  return {
    isMobile,
    visibility,
    setVisibility,
    viewMode,
    setViewMode,
    effectiveMode,
    titleLabel,
    navLabel,
    viewMenuValue,
    hourPx,
    timedDays,
    monthDays,
    anchor,
    events,
    isLoading,
    shiftAnchor,
    goToday,
    upcomingOpen,
    setUpcomingOpen,
    openEdit,
    openCreateAllDay,
    handleWeekSlotClick,
    handleWeekEventClick,
    slotSheet,
    slotSheetOpen,
    setSlotSheetOpen: handleSlotSheetOpenChange,
    handleSlotSheetEventClick,
    handleSlotSheetAdd,
    dialogOpen,
    setDialogOpen,
    editing,
    draftStart,
    draftEnd,
    draftAllDay,
    popoverAnchor,
  };
}
