"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { useMemo, useState } from "react";
import { CalendarEventDialog } from "@/components/calendar/CalendarEventDialog";
import { Icon } from "@/components/shared/Icon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWorkspace } from "@/context/workspace";
import type { CalendarEvent } from "@/types/calendar-event.type";
import { useDashboardOverview } from "../data/useDashboardOverview";
import { NextEventDetails } from "./NextEventDetails";
import { NextEventEmpty } from "./NextEventEmpty";
import { findNextEvent } from "./next-event-utils";

export function DashboardNextEvent() {
  const { workspaceSlug } = useWorkspace();
  const { events } = useDashboardOverview();
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);

  const now = useMemo(() => new Date(), []);
  const nextEvent = useMemo(
    () => findNextEvent(events, now),
    [events, now],
  );

  return (
    <Card size="sm" className="min-w-0 gap-4 overflow-hidden py-4">
      <CardHeader className="flex flex-row items-center gap-2.5 space-y-0">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Icon icon={Calendar03Icon} className="size-4" />
        </span>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Próximo evento
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {nextEvent ? (
          <NextEventDetails
            event={nextEvent}
            now={now}
            workspaceSlug={workspaceSlug}
            onEdit={() => setEditing(nextEvent)}
          />
        ) : (
          <NextEventEmpty
            workspaceSlug={workspaceSlug}
            onCreate={() => setOpenCreate(true)}
          />
        )}
      </CardContent>

      <CalendarEventDialog open={openCreate} onOpenChange={setOpenCreate} />
      <CalendarEventDialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        event={editing ?? undefined}
      />
    </Card>
  );
}
