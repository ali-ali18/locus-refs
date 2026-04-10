"use client";

import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/shared/Icon";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollections } from "@/hook/collections/useCollections";
import { useNotes } from "@/hook/notes/useNotes";

function countInRange(
  items: { createdAt: string }[],
  fromDaysAgo: number,
  toDaysAgo: number,
): number {
  const now = Date.now();
  const from = now - fromDaysAgo * 86_400_000;
  const to = now - toDaysAgo * 86_400_000;
  return items.filter((item) => {
    const t = new Date(item.createdAt).getTime();
    return t >= to && t <= from;
  }).length;
}

interface TrendBadgeProps {
  current: number;
  previous: number;
}

function TrendBadge({ current, previous }: TrendBadgeProps) {
  if (previous === 0 && current === 0) return null;

  const isUp = current >= previous;
  const diff = current - previous;
  const label = diff === 0 ? "0" : `${diff > 0 ? "+" : ""}${diff}`;

  return (
    <Badge variant="secondary" className="rounded-xl text-xs gap-1">
      <Icon icon={isUp ? ArrowUp01Icon : ArrowDown01Icon} className="size-3" />
      {label}
    </Badge>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  trendCurrent: number;
  trendPrevious: number;
  subtitle: string;
  description: string;
  loading?: boolean;
}

function StatCard({
  label,
  value,
  trendCurrent,
  trendPrevious,
  subtitle,
  description,
  loading,
}: StatCardProps) {
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardAction>
          {loading ? (
            <Skeleton className="h-5 w-14 rounded-xl" />
          ) : (
            <TrendBadge current={trendCurrent} previous={trendPrevious} />
          )}
        </CardAction>
        <CardDescription>{label}</CardDescription>
        {loading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {loading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <>
            <p className="text-sm font-medium">{subtitle}</p>
            <p className="text-xs text-muted-foreground">
              {trendPrevious === 0 && trendCurrent === 0
                ? "Não é possível realizar uma comparação semanal"
                : description}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const { data: notes = [], isLoading: loadingNotes } = useNotes();
  const { collections, isLoading: loadingCollections } = useCollections();

  const notesThisWeek = countInRange(notes, 7, 0);
  const notesLastWeek = countInRange(notes, 14, 7);
  const collectionsThisWeek = countInRange(collections, 7, 0);
  const collectionsLastWeek = countInRange(collections, 14, 7);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <StatCard
        label="Notas"
        value={notes.length}
        trendCurrent={notesThisWeek}
        trendPrevious={notesLastWeek}
        subtitle={`${notesThisWeek === 0 && "Nenhuma"} ${notesThisWeek <= 1 ? "nota" : "notas"} está semana`}
        description="Comparado com a semana anterior"
        loading={loadingNotes}
      />
      <StatCard
        label="Coleções"
        value={collections.length}
        trendCurrent={collectionsThisWeek}
        trendPrevious={collectionsLastWeek}
        subtitle={`${collectionsThisWeek === 0 && "Nenhuma"} ${collectionsThisWeek <= 1 ? "coleção" : "coleções"} está semana`}
        description="Comparado com a semana anterior"
        loading={loadingCollections}
      />
    </div>
  );
}
