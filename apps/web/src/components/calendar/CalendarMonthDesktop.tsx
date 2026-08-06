"use client";

import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar-event.type";
import {
  eventChipLabel,
  eventPastelColor,
  eventsForDay,
  format,
  isSameMonth,
  isToday,
  isWeekend,
  WEEKDAY_LABELS_SHORT,
} from "./calendar-utils";

interface Props {
  month: Date;
  events: CalendarEvent[];
  weeks: Date[][];
  maxChips: number;
  onDayClick: (day: Date, e: MouseEvent) => void;
  onEventClick: (event: CalendarEvent, e: MouseEvent) => void;
}

export function CalendarMonthDesktop({
  month,
  events,
  weeks,
  maxChips,
  onDayClick,
  onEventClick,
}: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col border-t border-border">
      <div className="grid shrink-0 grid-cols-7 border-b border-border">
        {WEEKDAY_LABELS_SHORT.map((label) => (
          <div
            key={label}
            className="px-2 py-2 text-center text-[12px] font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>

      <div
        className="grid min-h-0 flex-1"
        style={{
          gridTemplateRows: `repeat(${weeks.length}, minmax(0, 1fr))`,
        }}
      >
        {weeks.map((week) => (
          <div
            key={week[0].toISOString()}
            className="grid min-h-0 grid-cols-7 border-b border-border last:border-b-0"
          >
            {week.map((day) => {
              const inMonth = isSameMonth(day, month);
              const today = isToday(day);
              const dayEvents = eventsForDay(events, day);
              const visible = dayEvents.slice(0, maxChips);
              const overflow = dayEvents.length - visible.length;

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "relative flex min-h-0 flex-col gap-0.5 border-r border-border p-1.5 text-left last:border-r-0",
                    isWeekend(day) && inMonth && "bg-muted/20",
                    !inMonth && "bg-muted/10",
                  )}
                >
                  <button
                    type="button"
                    aria-label={`Criar evento em ${format(day, "d/MM")}`}
                    onClick={(e) => onDayClick(day, e)}
                    className="absolute inset-0 z-0 rounded-none hover:bg-muted/40"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDayClick(day, e);
                    }}
                    className={cn(
                      "relative z-1 mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] tabular-nums",
                      today &&
                        "bg-primary font-semibold text-primary-foreground",
                      !today && inMonth && "text-foreground",
                      !today && !inMonth && "text-muted-foreground/60",
                    )}
                  >
                    {format(day, "d")}
                  </button>

                  <div className="relative z-1 flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
                    {visible.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event, e);
                        }}
                        className="truncate rounded-md px-1.5 py-0.5 text-left text-[11px] font-medium leading-snug text-foreground shadow-xs"
                        style={{ backgroundColor: eventPastelColor(event) }}
                        title={event.title}
                      >
                        {eventChipLabel(event)}
                      </button>
                    ))}
                    {overflow > 0 ? (
                      <span className="px-1.5 text-[11px] font-medium text-muted-foreground">
                        +{overflow} mais
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
