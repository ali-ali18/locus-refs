"use client";

import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar-event.type";
import {
  eventTimeLine,
  eventsForDay,
  format,
  isSameMonth,
  isToday,
  isWeekend,
  resolveEventHex,
  WEEKDAY_LABELS_SHORT,
} from "./calendar-utils";

interface Props {
  month: Date;
  days: Date[];
  events: CalendarEvent[];
  weeks: Date[][];
  weekLabels: readonly string[];
  selectedDay: Date;
  selectedEvents: CalendarEvent[];
  selectedDayLabel: string;
  maxDots: number;
  isSameDay: (a: Date, b: Date) => boolean;
  onSelectDay: (day: Date) => void;
  onDayClick: (day: Date, e: MouseEvent) => void;
  onEventClick: (event: CalendarEvent, e: MouseEvent) => void;
}

export function CalendarMonthCompact({
  month,
  days,
  events,
  weeks,
  weekLabels,
  selectedDay,
  selectedEvents,
  selectedDayLabel,
  maxDots,
  isSameDay,
  onSelectDay,
  onDayClick,
  onEventClick,
}: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col border-t border-border">
      <div className="grid shrink-0 grid-cols-7 border-b border-border">
        {weekLabels.map((label, weekdayIndex) => (
          <div
            key={WEEKDAY_LABELS_SHORT[weekdayIndex]}
            className="py-2 text-center text-[11px] font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="shrink-0 border-b border-border">
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const inMonth = isSameMonth(day, month);
            const today = isToday(day);
            const selected = isSameDay(day, selectedDay);
            const dayEvents = eventsForDay(events, day);
            const dots = dayEvents.slice(0, maxDots);
            const more = dayEvents.length - dots.length;
            const isLastCol = index % 7 === 6;
            const row = Math.floor(index / 7);
            const isLastRow = row === weeks.length - 1;

            return (
              <button
                key={day.toISOString()}
                type="button"
                aria-label={`${format(day, "d/MM")}${
                  dayEvents.length
                    ? `, ${dayEvents.length} evento${dayEvents.length > 1 ? "s" : ""}`
                    : ""
                }`}
                aria-pressed={selected}
                onClick={() => onSelectDay(day)}
                className={cn(
                  "relative aspect-square",
                  !isLastCol && "border-r border-border/70",
                  !isLastRow && "border-b border-border/70",
                  isWeekend(day) && inMonth && "bg-muted/20",
                  !inMonth && "bg-muted/10",
                  selected && "bg-accent/60",
                  "hover:bg-muted/35 active:bg-muted/50",
                )}
              >
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-[12px] tabular-nums",
                      today &&
                        "bg-primary font-semibold text-primary-foreground",
                      !today && selected && inMonth && "font-semibold",
                      !today && inMonth && "text-foreground",
                      !today && !inMonth && "text-muted-foreground/50",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <span className="flex h-1.5 items-center justify-center gap-0.5">
                    {dots.map((event) => (
                      <span
                        key={event.id}
                        className="size-1.5 rounded-full"
                        style={{
                          backgroundColor: resolveEventHex(event.color),
                        }}
                      />
                    ))}
                    {more > 0 ? (
                      <span className="text-[9px] font-medium leading-none text-muted-foreground">
                        +{more}
                      </span>
                    ) : null}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-3">
          <p className="text-sm font-medium capitalize text-foreground">
            {selectedDayLabel}
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={(e) => onDayClick(selectedDay, e)}
          >
            Novo
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {selectedEvents.length === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">
              Nenhum evento neste dia
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={(e) => onEventClick(event, e)}
                  className="flex w-full overflow-hidden rounded-2xl border border-border bg-background text-left transition-colors hover:bg-accent/40"
                >
                  <span
                    className="w-1 shrink-0 self-stretch"
                    style={{
                      backgroundColor: resolveEventHex(event.color),
                    }}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 px-3 py-2.5">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {event.title}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      {eventTimeLine(event)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
