export const PULSE_DAYS = 35;
export const DAY_MS = 24 * 60 * 60 * 1000;

export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function intensityClass(count: number): string {
  if (count === 0) return "bg-surface-contrast-foreground/12";
  if (count === 1) return "bg-primary/40";
  if (count < 4) return "bg-primary/70";
  return "bg-primary";
}

export function bump(counts: Map<string, number>, dateStr: string) {
  const key = dayKey(new Date(dateStr));
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

export type PulseDay = {
  key: string;
  count: number;
  date: Date;
};

export function buildPulseDays(
  updatedAts: string[],
  days = PULSE_DAYS,
): PulseDay[] {
  const counts = new Map<string, number>();
  for (const dateStr of updatedAts) bump(counts, dateStr);

  const start = new Date(Date.now() - (days - 1) * DAY_MS);
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(start.getTime() + i * DAY_MS);
    const key = dayKey(date);
    return { key, count: counts.get(key) ?? 0, date };
  });
}
