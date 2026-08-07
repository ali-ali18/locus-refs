"use client";

import { useWorkspace } from "@/context/workspace";
import { useDashboardOverview } from "../data/useDashboardOverview";
import { PinChip } from "./PinChip";

/** Chips de notas favoritas — fica no header da home. */
export function DashboardPinnedChips() {
  const { workspaceSlug } = useWorkspace();
  const { pins } = useDashboardOverview();
  const favorites = pins?.favorites ?? [];

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="flex max-w-full items-center gap-2 overflow-x-auto scrollbar-none">
      {favorites.map((item) => (
        <PinChip key={item.id} item={item} workspaceSlug={workspaceSlug} />
      ))}
    </div>
  );
}
