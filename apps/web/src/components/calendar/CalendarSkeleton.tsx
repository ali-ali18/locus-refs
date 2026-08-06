"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  type CalendarViewMode,
  gridTemplateColumns,
  HOUR_END,
  HOUR_PX,
  HOUR_START,
  isHourMark,
} from "./calendar-utils";

interface Props {
  mode: CalendarViewMode;
  compact?: boolean;
}

/** Poucos cards, em horas “reais” — evita o visual de blocos aleatórios. */
const WEEK_PLACEHOLDERS: { day: number; hour: number; span: number }[] = [
  { day: 1, hour: 9, span: 1 },
  { day: 2, hour: 11, span: 2 },
  { day: 3, hour: 14, span: 1 },
  { day: 5, hour: 10, span: 1.5 },
];

const DAY_PLACEHOLDERS: { hour: number; span: number }[] = [
  { hour: 9, span: 1 },
  { hour: 13, span: 2 },
  { hour: 16, span: 1 },
];

function TimedGridSkeleton({
  dayCount,
  placeholders,
}: {
  dayCount: number;
  placeholders: { day: number; hour: number; span: number }[];
}) {
  const hours = Array.from(
    { length: HOUR_END - HOUR_START + 1 },
    (_, i) => HOUR_START + i,
  );
  const gridHeight = hours.length * HOUR_PX;
  const cols = gridTemplateColumns(dayCount);
  const days = Array.from({ length: dayCount }, (_, i) => i);

  return (
    <div className="relative h-full min-h-0 overflow-hidden border-t border-border">
      <div className="sticky top-0 z-3 bg-background">
        <div
          className="grid border-b border-border"
          style={{ gridTemplateColumns: cols }}
        >
          <div className="flex items-center justify-center py-2.5">
            <Skeleton className="h-2.5 w-9 rounded-md" />
          </div>
          {days.map((d) => (
            <div key={d} className="flex items-center justify-center py-2.5">
              <Skeleton
                className={cn(
                  "h-3 rounded-md",
                  dayCount === 1 ? "w-24" : "w-14",
                )}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div
          className="relative grid"
          style={{ gridTemplateColumns: cols, height: gridHeight }}
        >
          <div className="relative border-r border-border">
            {hours.map((hour) =>
              hour === HOUR_START || !isHourMark(hour) ? null : (
                <span
                  key={hour}
                  className="absolute right-2 -translate-y-1/2"
                  style={{ top: (hour - HOUR_START) * HOUR_PX }}
                >
                  <Skeleton className="h-2.5 w-7 rounded-md" />
                </span>
              ),
            )}
          </div>

          {days.map((day) => (
            <div
              key={day}
              className="relative border-r border-border last:border-r-0"
            >
              {hours.map((hour) =>
                hour !== HOUR_START && isHourMark(hour) ? (
                  <div
                    key={hour}
                    className="pointer-events-none absolute inset-x-0 border-t border-border/60"
                    style={{ top: (hour - HOUR_START) * HOUR_PX }}
                  />
                ) : null,
              )}

              {placeholders
                .filter((p) => p.day === day)
                .map((p) => (
                  <Skeleton
                    key={`${p.day}-${p.hour}`}
                    className="absolute inset-x-1.5 rounded-2xl"
                    style={{
                      top: (p.hour - HOUR_START) * HOUR_PX + 4,
                      height: p.span * HOUR_PX - 8,
                    }}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MonthSkeleton({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex h-full min-h-0 flex-col border-t border-border">
        <div className="grid shrink-0 grid-cols-7 border-b border-border">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="flex items-center justify-center py-2">
              <Skeleton className="h-2.5 w-3 rounded-md" />
            </div>
          ))}
        </div>
        <div className="shrink-0 border-b border-border">
          <div className="grid grid-cols-7">
            {Array.from({ length: 42 }, (_, i) => (
              <div
                key={i}
                className="flex aspect-square flex-col items-center justify-center gap-1 border-b border-r border-border/70"
              >
                <Skeleton className="size-6 rounded-full" />
                {i % 7 === 2 || i % 7 === 4 ? (
                  <Skeleton className="size-1.5 rounded-full" />
                ) : (
                  <span className="h-1.5" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-2 px-4 py-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-7 w-14 rounded-2xl" />
          </div>
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col border-t border-border">
      <div className="grid shrink-0 grid-cols-7 border-b border-border">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="flex items-center justify-center px-2 py-2">
            <Skeleton className="h-2.5 w-7 rounded-md" />
          </div>
        ))}
      </div>
      <div
        className="grid min-h-0 flex-1"
        style={{ gridTemplateRows: "repeat(6, minmax(0, 1fr))" }}
      >
        {Array.from({ length: 6 }, (_, row) => (
          <div
            key={row}
            className="grid min-h-0 grid-cols-7 border-b border-border last:border-b-0"
          >
            {Array.from({ length: 7 }, (_, col) => {
              const showChip = (row + col) % 5 === 0;
              return (
                <div
                  key={col}
                  className="flex min-h-0 flex-col gap-1 border-r border-border p-1.5 last:border-r-0"
                >
                  <Skeleton className="size-7 rounded-full" />
                  {showChip ? (
                    <Skeleton className="h-4 w-full rounded-md" />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalendarSkeleton({ mode, compact = false }: Props) {
  if (mode === "month") return <MonthSkeleton compact={compact} />;
  if (mode === "day") {
    return (
      <TimedGridSkeleton
        dayCount={1}
        placeholders={DAY_PLACEHOLDERS.map((p) => ({ ...p, day: 0 }))}
      />
    );
  }
  return (
    <TimedGridSkeleton dayCount={7} placeholders={WEEK_PLACEHOLDERS} />
  );
}
