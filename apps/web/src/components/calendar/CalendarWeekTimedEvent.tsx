"use client";

import type { MouseEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar-event.type";
import {
  eventPastelColor,
  eventPeople,
  format,
  initials,
} from "./calendar-utils";

const GAP = 4;

interface Props {
  event: CalendarEvent;
  top: number;
  height: number;
  column: number;
  columns: number;
  hourPx: number;
  onEventClick: (event: CalendarEvent, e: MouseEvent) => void;
}

export function CalendarWeekTimedEvent({
  event,
  top,
  height,
  column,
  columns,
  hourPx,
  onEventClick,
}: Props) {
  const widthPct = 100 / columns;
  const leftPct = column * widthPct;
  const blockH = Math.max(height - GAP * 2, 56);
  const start = new Date(event.startAt);
  const end = event.endAt ? new Date(event.endAt) : null;
  const timeLabel = end
    ? `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`
    : format(start, "HH:mm");
  const subtitle =
    event.description?.trim() || (blockH >= 44 ? timeLabel : null);
  const showPeople = event.visibility === "workspace" && blockH >= 56;
  const people = showPeople ? eventPeople(event).slice(0, 3) : [];
  const showImage = !!event.imageUrl && height >= hourPx * 2;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onEventClick(event, e);
      }}
      className="absolute z-1 flex flex-col items-stretch justify-start overflow-hidden rounded-2xl border-0 py-2 text-left text-foreground shadow-sm transition-opacity hover:opacity-90"
      style={{
        top: top + GAP,
        height: blockH,
        left: `calc(${leftPct}% + ${GAP}px)`,
        width: `calc(${widthPct}% - ${GAP * 2}px)`,
        backgroundColor: eventPastelColor(event),
      }}
    >
      <span className="line-clamp-3 block w-full wrap-break-word px-2.5 text-sm font-medium leading-snug">
        {event.title}
      </span>
      {subtitle ? (
        <span className="mt-0.5 line-clamp-2 w-full px-2.5 text-left text-[11px] leading-snug text-foreground/70">
          {subtitle}
        </span>
      ) : null}
      {people.length > 0 ? (
        <span className="mt-1.5 flex items-center px-2.5">
          {people.map((person, i) => (
            <Avatar
              key={person.id}
              size="sm"
              className={cn(
                "size-5 border border-background",
                i > 0 && "-ml-1.5",
              )}
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
      ) : null}
      {showImage ? (
        <span className="mt-5.5 min-h-0 flex-1 px-2">
          <img
            src={event.imageUrl ?? undefined}
            alt=""
            className="h-full w-full rounded-xl object-cover"
          />
        </span>
      ) : null}
    </button>
  );
}
