import type { Board, Note } from "@refstash/shared";
import type { CollectionItem } from "../data/useDashboardOverviewQueries";

export type ActivityType = "note" | "collection" | "board";

export type ActivityItem = {
  id: string;
  name: string;
  type: ActivityType;
  updatedAt: string;
};

export function hrefFor(workspaceSlug: string, item: ActivityItem): string {
  if (item.type === "note") return `/${workspaceSlug}/notes/${item.id}`;
  if (item.type === "collection")
    return `/${workspaceSlug}/collections/${item.id}`;
  return `/${workspaceSlug}/boards/${item.id}`;
}

export function typeLabel(type: ActivityType) {
  if (type === "note") return "Nota";
  if (type === "collection") return "Coleção";
  return "Board";
}

export function buildRecentActivity(
  notes: Note[],
  collections: CollectionItem[],
  boards: Board[],
  limit = 3,
): ActivityItem[] {
  return [
    ...notes.map((n) => ({
      id: n.id,
      name: n.title || "Sem título",
      type: "note" as const,
      updatedAt: n.updatedAt,
    })),
    ...collections.map((c) => ({
      id: c.id,
      name: c.name,
      type: "collection" as const,
      updatedAt: c.updatedAt,
    })),
    ...boards.map((b) => ({
      id: b.id,
      name: b.title || "Board",
      type: "board" as const,
      updatedAt: b.updatedAt,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit);
}
