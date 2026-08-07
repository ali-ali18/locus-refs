"use client";

import type { MouseEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CalendarEvent } from "@/types/calendar-event.type";
import {
  eventPeople,
  eventUpcomingTimeLabel,
  initials,
  resolveEventHex,
} from "./calendar-utils";

interface Props {
  event: CalendarEvent;
  onClick: (event: CalendarEvent, e: MouseEvent) => void;
}

export function CalendarUpcomingCard({ event, onClick }: Props) {
  const people = eventPeople(event).slice(0, 3);
  const accent = resolveEventHex(event.color);

  return (
    <button
      type="button"
      onClick={(e) => onClick(event, e)}
      className="flex w-full overflow-hidden rounded-2xl border border-border bg-background text-left transition-colors hover:bg-accent/40"
    >
      <span
        className="w-1 shrink-0 self-stretch"
        style={{ backgroundColor: accent }}
      />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5 px-3 py-2.5">
        <span className="truncate text-sm font-semibold text-foreground">
          {event.title}
        </span>
        <span className="text-[12px] text-muted-foreground">
          {eventUpcomingTimeLabel(event)}
        </span>
        {people.length > 0 ? (
          <span className="flex items-center gap-1.5">
            <span className="flex">
              {people.map((person, i) => (
                <Avatar
                  key={person.id}
                  size="sm"
                  className={`size-5 border border-background ${i > 0 ? "-ml-1.5" : ""}`}
                >
                  <AvatarImage
                    src={person.image ?? undefined}
                    alt={person.name}
                  />
                  <AvatarFallback className="text-[8px]">
                    {initials(person.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {people[0]?.name}
              {people.length > 1 ? ` +${people.length - 1}` : ""}
            </span>
          </span>
        ) : null}
      </span>
    </button>
  );
}
