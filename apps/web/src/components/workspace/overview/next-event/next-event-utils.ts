import type { CalendarEvent } from "@/types/calendar-event.type";

export function countdownLabel(event: CalendarEvent, now: Date): string {
  const start = new Date(event.startAt);
  const diffMs = start.getTime() - now.getTime();

  if (diffMs <= 0) {
    if (event.allDay) return "Acontecendo hoje";
    return "Em andamento";
  }

  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 60) return `Em ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (hours < 24) {
    return rem > 0 ? `Em ${hours}h ${rem}min` : `Em ${hours}h`;
  }

  const days = Math.floor(hours / 24);
  if (days === 1) return "Amanhã";
  return `Em ${days} dias`;
}

export function durationLabel(event: CalendarEvent): string | null {
  if (event.allDay || !event.endAt) return null;
  const ms =
    new Date(event.endAt).getTime() - new Date(event.startAt).getTime();
  if (ms <= 0) return null;
  const minutes = Math.round(ms / 60_000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0 ? `${hours}h ${rem}min` : `${hours}h`;
}

export function peopleSummary(people: { name: string }[]): string {
  if (people.length === 0) return "Só você";
  if (people.length === 1) return people[0].name;
  if (people.length === 2) return `${people[0].name} e ${people[1].name}`;
  return `${people[0].name} +${people.length - 1}`;
}

export function findNextEvent(
  events: CalendarEvent[],
  now: Date,
): CalendarEvent | undefined {
  return [...events]
    .filter((event) => {
      const end = event.endAt
        ? new Date(event.endAt)
        : new Date(event.startAt);
      return end.getTime() >= now.getTime();
    })
    .sort(
      (a, b) =>
        new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    )[0];
}
