"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarEventDialog } from "@/components/calendar/CalendarEventDialog";
import { timedEventsForDay } from "@/components/calendar/calendar-utils";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/context/workspace";
import type { CalendarEvent } from "@/types/calendar-event.type";
import { useDashboardOverview } from "../data/useDashboardOverview";
import { AgendaTimeline } from "./AgendaTimeline";

export function DashboardAgenda() {
  const { workspaceSlug } = useWorkspace();
  const { events } = useDashboardOverview();
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);

  const today = useMemo(() => new Date(), []);
  const timed = timedEventsForDay(events, today);

  return (
    <section className="flex h-fit min-w-0 flex-col gap-4 overflow-hidden rounded-3xl bg-surface-contrast p-4 text-surface-contrast-foreground sm:p-5">
      <header className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col">
          <h2 className="text-base font-semibold">Agenda de reuniões</h2>
          <p className="text-xs text-surface-contrast-muted capitalize">
            {today.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full"
            onClick={() => setOpenCreate(true)}
          >
            Novo evento
          </Button>
          <Button
            size="sm"
            variant="ghost"
            nativeButton={false}
            className="rounded-full text-surface-contrast-foreground hover:bg-surface-contrast-foreground/10 hover:text-surface-contrast-foreground"
            render={<Link href={`/${workspaceSlug}/calendar`} />}
          >
            <span className="sm:hidden">Calendário</span>
            <span className="hidden sm:inline">Ver calendário</span>
          </Button>
        </div>
      </header>

      <AgendaTimeline events={timed} onSelect={setEditing} />

      <CalendarEventDialog open={openCreate} onOpenChange={setOpenCreate} />
      <CalendarEventDialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        event={editing ?? undefined}
      />
    </section>
  );
}
