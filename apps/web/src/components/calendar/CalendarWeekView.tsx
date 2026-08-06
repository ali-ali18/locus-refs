"use client";

import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar-event.type";
import {
  allDayEventsForDay,
  dayHeaderParts,
  eventPastelColor,
  formatHour,
  HOUR_END,
  HOUR_PX,
  HOUR_START,
  isHourMark,
  isToday,
  isWeekend,
  layoutTimedEvents,
} from "./calendar-utils";
import { CalendarWeekTimedEvent } from "./CalendarWeekTimedEvent";
import { useCalendarWeekView } from "./hook/useCalendarWeekView";

const WEEKEND_BG =
  "bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,color-mix(in_oklch,var(--border)_60%,transparent)_5px,color-mix(in_oklch,var(--border)_60%,transparent)_6px)]";

interface Props {
  days: Date[];
  events: CalendarEvent[];
  hourPx?: number;
  onSlotClick: (day: Date, hour: number, e: MouseEvent) => void;
  onEventClick: (event: CalendarEvent, e: MouseEvent) => void;
}

export function CalendarWeekView({
  days,
  events,
  hourPx = HOUR_PX,
  onSlotClick,
  onEventClick,
}: Props) {
  const { hours, scrollRef, gridHeight, cols, gmt, hasAllDay, now } =
    useCalendarWeekView({ days, events, hourPx });

  return (
    <div ref={scrollRef} className="relative h-full min-h-0 overflow-y-auto">
      <div className="sticky top-0 z-3 bg-background">
        <div
          className="grid border-b border-border"
          style={{ gridTemplateColumns: cols }}
        >
          <div className="flex items-center justify-center py-2.5">
            <span className="text-[11px] text-muted-foreground">{gmt}</span>
          </div>

          {days.map((day) => {
            const { weekday, date } = dayHeaderParts(day);
            const today = isToday(day);
            return (
              <div
                key={day.toISOString()}
                className="flex items-center justify-center py-2.5"
              >
                <p
                  className={cn(
                    "text-[13px]",
                    today
                      ? "font-semibold text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {weekday} <span className="tabular-nums">{date}</span>
                </p>
              </div>
            );
          })}
        </div>

        {hasAllDay ? (
          <div
            className="grid border-b border-border"
            style={{ gridTemplateColumns: cols }}
          >
            <div className="border-r border-border" />
            {days.map((day) => {
              const dayEvents = allDayEventsForDay(events, day);
              return (
                <div
                  key={`allday-${day.toISOString()}`}
                  className={cn(
                    "min-h-8 space-y-0.5 border-r border-border p-1 last:border-r-0",
                    isWeekend(day) && WEEKEND_BG,
                  )}
                >
                  {dayEvents.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={(e) => onEventClick(event, e)}
                      className="flex w-full items-center gap-1.5 overflow-hidden rounded-xl text-left text-[11px] font-medium text-foreground shadow-xs"
                      style={{ backgroundColor: eventPastelColor(event) }}
                    >
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt=""
                          className="h-7 w-8 shrink-0 object-cover"
                        />
                      ) : null}
                      <span className="min-w-0 flex-1 truncate px-2 py-1">
                        {event.title}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="relative">
        <div
          className="relative grid"
          style={{ gridTemplateColumns: cols, height: gridHeight }}
        >
          <div className="relative border-r border-border">
            {hours.map((hour) =>
              hour === HOUR_START || !isHourMark(hour) ? null : (
                <span
                  key={hour}
                  className="absolute right-2 -translate-y-1/2 text-[11px] tabular-nums text-muted-foreground"
                  style={{ top: (hour - HOUR_START) * hourPx }}
                >
                  {formatHour(hour)}
                </span>
              ),
            )}
          </div>

          {days.map((day) => {
            const positions = layoutTimedEvents(events, day, hourPx);
            return (
              <div
                key={`col-${day.toISOString()}`}
                className={cn(
                  "relative border-r border-border last:border-r-0",
                  isWeekend(day) && WEEKEND_BG,
                )}
              >
                {hours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    aria-label={`Criar às ${formatHour(hour)}`}
                    onClick={(e) => onSlotClick(day, hour, e)}
                    className={cn(
                      "absolute inset-x-0 hover:bg-muted/35",
                      hour !== HOUR_START &&
                        isHourMark(hour) &&
                        "border-t border-border/70",
                      hour === HOUR_END && "border-b border-border/70",
                    )}
                    style={{
                      top: (hour - HOUR_START) * hourPx,
                      height: hourPx,
                    }}
                  />
                ))}

                {positions.map(({ event, top, height, column, columns }) => (
                  <CalendarWeekTimedEvent
                    key={event.id}
                    event={event}
                    top={top}
                    height={height}
                    column={column}
                    columns={columns}
                    hourPx={hourPx}
                    onEventClick={onEventClick}
                  />
                ))}
              </div>
            );
          })}

          {now ? (
            <div
              className="pointer-events-none absolute inset-x-0 z-2"
              style={{ top: now.top }}
            >
              <div
                className="grid items-center"
                style={{ gridTemplateColumns: cols }}
              >
                <div className="relative h-0">
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm bg-primary px-1 py-px text-[10px] font-semibold tabular-nums text-primary-foreground">
                    {now.label}
                  </span>
                </div>
                <div
                  className="relative flex h-0 items-center"
                  style={{ gridColumn: `span ${days.length}` }}
                >
                  <span className="absolute -left-1 size-2 rounded-full bg-primary" />
                  <span className="h-px w-full bg-primary" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
