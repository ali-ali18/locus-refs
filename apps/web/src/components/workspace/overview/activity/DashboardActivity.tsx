"use client";

import { useMemo } from "react";
import { useWorkspace } from "@/context/workspace";
import { useDashboardOverview } from "../data/useDashboardOverview";
import { ActivityListItem } from "./ActivityListItem";
import { buildRecentActivity } from "./buildRecentActivity";

export function DashboardActivity() {
  const { workspaceSlug } = useWorkspace();
  const { notes, collections, boards } = useDashboardOverview();

  const recent = useMemo(
    () => buildRecentActivity(notes, collections, boards),
    [notes, collections, boards],
  );

  return (
    <section className="flex min-w-0 flex-col gap-3 overflow-hidden rounded-3xl bg-surface-contrast p-4 text-surface-contrast-foreground">
      <header className="flex flex-col gap-1 px-1">
        <h2 className="text-base font-semibold">Atividade recente</h2>
        <p className="text-xs text-surface-contrast-muted">
          Últimas notas, coleções e boards tocados.
        </p>
      </header>

      <div className="flex flex-col gap-0.5">
        {recent.length === 0 ? (
          <p className="px-1 py-4 text-sm text-surface-contrast-muted">
            Nada por aqui ainda — crie sua primeira nota ou coleção.
          </p>
        ) : (
          recent.map((item) => (
            <ActivityListItem
              key={`${item.type}-${item.id}`}
              item={item}
              workspaceSlug={workspaceSlug}
            />
          ))
        )}
      </div>
    </section>
  );
}
