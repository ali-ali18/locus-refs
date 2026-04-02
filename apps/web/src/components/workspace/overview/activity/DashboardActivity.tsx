"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/context/workspace";
import { useCollections } from "@/hook/collections/useCollections";
import { useNotes } from "@/hook/notes/useNotes";
import { ActivityListItem } from "./ActivityListItem";

export function DashboardActivity() {
  const { workspaceSlug } = useWorkspace();
  const { data: notes = [], isLoading: loadingNotes } = useNotes();
  const { collections, isLoading: loadingCollections } = useCollections();

  const isLoading = loadingNotes || loadingCollections;

  const recent = [
    ...notes.map((n) => ({
      id: n.id,
      name: n.title,
      type: "note" as const,
      updatedAt: n.updatedAt,
    })),
    ...collections.map((c) => ({
      id: c.id,
      name: c.name,
      type: "collection" as const,
      updatedAt: c.updatedAt,
    })),
  ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Atividade recente</CardTitle>
        <CardDescription>
          Veja as últimas notas e coleções atualizadas.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-xl" />
          ))
        ) : recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma atividade ainda.</p>
        ) : (
          recent.map((item) => (
            <ActivityListItem key={`${item.type}-${item.id}`} {...item} workspaceSlug={workspaceSlug} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
