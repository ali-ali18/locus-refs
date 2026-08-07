"use client";

import type { CSSProperties } from "react";
import {
  eventPastelColor,
  eventPeople,
  eventTimeLine,
  initials,
} from "@/components/calendar/calendar-utils";
import type { CalendarEvent } from "@/types/calendar-event.type";

export function AgendaMeetingCard({
  event,
  onClick,
  style,
}: {
  event: CalendarEvent;
  onClick: () => void;
  style: CSSProperties;
}) {
  const people = eventPeople(event);
  const subtitle = event.description?.trim() || eventTimeLine(event);

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${event.title} · ${eventTimeLine(event)}`}
      style={{ ...style, backgroundColor: eventPastelColor(event) }}
      className="absolute box-border flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-2 text-left text-foreground shadow-sm transition-transform hover:-translate-y-px"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">
          {event.title}
        </span>
        <span className="block truncate text-xs opacity-70">{subtitle}</span>
      </span>

      {people.length > 0 ? (
        <span className="flex shrink-0 -space-x-1.5">
          {people.slice(0, 3).map((person) => (
            <span
              key={person.id}
              className="flex size-6 items-center justify-center rounded-full bg-background/80 text-[10px] font-medium text-foreground ring-1 ring-background/60"
            >
              {person.image ? (
                <img
                  src={person.image}
                  alt={person.name}
                  className="size-full rounded-full object-cover"
                />
              ) : (
                initials(person.name)
              )}
            </span>
          ))}
        </span>
      ) : null}
    </button>
  );
}
