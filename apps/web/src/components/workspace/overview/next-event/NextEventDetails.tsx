"use client";

import { Clock01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import {
  eventPeople,
  eventUpcomingTimeLabel,
  initials,
} from "@/components/calendar/calendar-utils";
import { Icon } from "@/components/shared/Icon";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "@/types/calendar-event.type";
import { NextEventCountdownAction } from "./NextEventCountdownAction";
import { durationLabel, peopleSummary } from "./next-event-utils";

export function NextEventDetails({
  event,
  now,
  workspaceSlug,
  onEdit,
}: {
  event: CalendarEvent;
  now: Date;
  workspaceSlug: string;
  onEdit: () => void;
}) {
  const people = eventPeople(event).slice(0, 5);
  const duration = durationLabel(event);

  return (
    <>
      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="truncate text-xl font-semibold tracking-tight text-foreground">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {eventUpcomingTimeLabel(event)}
        </p>

        <div className="mt-1 flex min-w-0 items-center gap-2">
          {people.length > 0 ? (
            <AvatarGroup>
              {people.map((person) => (
                <Avatar key={person.id} size="sm">
                  <AvatarImage
                    src={person.image ?? undefined}
                    alt={person.name}
                  />
                  <AvatarFallback className="text-[9px]">
                    {initials(person.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
          ) : null}
          <p className="min-w-0 truncate text-sm text-muted-foreground">
            com{" "}
            <span className="font-medium text-foreground">
              {peopleSummary(people)}
            </span>
          </p>
        </div>
      </div>

      <NextEventCountdownAction event={event} now={now} onEdit={onEdit} />

      <div className="divide-y divide-border/70">
        <div className="flex items-center justify-between gap-3 py-2.5">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon icon={UserGroupIcon} className="size-4" />
            Participantes
          </span>
          <span className="text-sm font-medium text-foreground">
            {Math.max(people.length, 1)}
          </span>
        </div>
        {duration ? (
          <div className="flex items-center justify-between gap-3 py-2.5">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon icon={Clock01Icon} className="size-4" />
              Duração
            </span>
            <span className="text-sm font-medium text-foreground">
              {duration}
            </span>
          </div>
        ) : null}
      </div>

      {event.description?.trim() ? (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {event.description}
        </p>
      ) : null}

      <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row">
        <Button
          variant="secondary"
          onClick={onEdit}
        >
          Editar
        </Button>
        <Button
          nativeButton={false}
          render={<Link href={`/${workspaceSlug}/calendar`} />}
        >
          Abrir agenda
        </Button>
      </div>
    </>
  );
}
