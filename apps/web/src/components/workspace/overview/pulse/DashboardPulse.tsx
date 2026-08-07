"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useDashboardOverview } from "../data/useDashboardOverview";
import { buildPulseDays, intensityClass, PULSE_DAYS } from "./pulse-utils";

export function DashboardPulse() {
  const { notes, collections, boards, kanbanBoards, events } =
    useDashboardOverview();

  const days = useMemo(() => {
    const updatedAts = [
      ...notes.map((note) => note.updatedAt),
      ...collections.map((collection) => collection.updatedAt),
      ...boards.map((board) => board.updatedAt),
      ...kanbanBoards.map((board) => board.updatedAt),
      ...events.map((event) => event.updatedAt ?? event.startAt),
    ];
    return buildPulseDays(updatedAts);
  }, [notes, collections, boards, kanbanBoards, events]);

  const active = days.filter((day) => day.count > 0).length;

  return (
    <section className="flex h-full min-w-0 flex-col justify-between gap-5 overflow-hidden rounded-3xl bg-surface-contrast p-4 text-surface-contrast-foreground sm:p-5">
      <header className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">Intensidade da equipe</h2>
        <p className="text-xs text-surface-contrast-muted">
          Últimos {PULSE_DAYS} dias · notas, coleções, boards, kanban e agenda
        </p>
      </header>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => (
          <span
            key={day.key}
            title={`${day.date.toLocaleDateString("pt-BR")} · ${day.count} atualizações`}
            className={cn(
              "aspect-square rounded-md",
              intensityClass(day.count),
            )}
          />
        ))}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold tabular-nums">{active}</span>
          <span className="text-xs text-surface-contrast-muted">
            dias com atividade
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-surface-contrast-muted">
          <span>menos</span>
          <span className="size-2.5 rounded-sm bg-surface-contrast-foreground/12" />
          <span className="size-2.5 rounded-sm bg-primary/40" />
          <span className="size-2.5 rounded-sm bg-primary/70" />
          <span className="size-2.5 rounded-sm bg-primary" />
          <span>mais</span>
        </div>
      </div>
    </section>
  );
}
