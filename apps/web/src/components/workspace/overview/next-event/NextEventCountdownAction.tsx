"use client";

import {
  ArrowRight01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "@/types/calendar-event.type";
import { countdownLabel } from "./next-event-utils";

export function NextEventCountdownAction({
  event,
  now,
  onEdit,
}: {
  event: CalendarEvent;
  now: Date;
  onEdit: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(keyboardEvent) => {
        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          keyboardEvent.preventDefault();
          onEdit();
        }
      }}
      className="flex w-full cursor-pointer flex-col gap-1 rounded-2xl border border-transparent bg-muted/50 px-3.5 py-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/8"
    >
      <div className="flex items-center gap-2">
        <Icon
          icon={Clock01Icon}
          className="size-4 shrink-0 text-foreground"
        />
        <span className="min-w-0 truncate text-sm font-semibold text-foreground">
          {countdownLabel(event, now)}
        </span>
      </div>

      <div className="ml-6 flex items-center gap-2">
        <span className="min-w-0 truncate text-sm text-muted-foreground">
          {event.visibility === "workspace"
            ? "Visível no workspace"
            : "Evento pessoal"}
        </span>
        <Button
          size="icon-sm"
          className="pointer-events-none ml-auto shrink-0 rounded-lg"
          tabIndex={-1}
        >
          <Icon icon={ArrowRight01Icon} />
        </Button>
      </div>
    </div>
  );
}
