/** Parse YYYY-MM-DD into a stable UTC noon Date (or null). */
export function parseKanbanDueDate(
  value: string | null | undefined,
): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return new Date(`${value}T12:00:00.000Z`);
}

/** Format stored dueDate to YYYY-MM-DD for date inputs. */
export function formatKanbanDueDateInput(
  value: string | Date | null | undefined,
): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

/** Parse YYYY-MM-DD into a local Date for Calendar selection (avoids TZ offset). */
export function kanbanDueDateToLocalDate(
  value: string | null | undefined,
): Date | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

/** Format a local Date from Calendar into YYYY-MM-DD. */
export function localDateToKanbanDueDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export type KanbanDueDateRange = {
  startDate: string | null;
  dueDate: string | null;
};

export function formatKanbanDueDateLabel(
  startDate: string | Date | null | undefined,
  dueDate?: string | Date | null | undefined,
): string | null {
  const endIso = formatKanbanDueDateInput(
    dueDate === undefined ? startDate : dueDate,
  );
  const startIso =
    dueDate === undefined ? "" : formatKanbanDueDateInput(startDate);

  if (!endIso && !startIso) return null;

  const formatPart = (iso: string) => {
    const [year, month, day] = iso.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  if (startIso && endIso) {
    if (startIso === endIso) return formatPart(endIso);
    return `${formatPart(startIso)} – ${formatPart(endIso)}`;
  }

  return formatPart(endIso || startIso);
}

export function isKanbanDueDateOverdue(
  dueDate: string | Date | null | undefined,
): boolean {
  const iso = formatKanbanDueDateInput(dueDate);
  if (!iso) return false;
  const today = new Date();
  const todayIso = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  return iso < todayIso;
}

export type KanbanDueFilterPreset =
  | "today"
  | "this_week"
  | "this_month"
  | "last_month"
  | "month"
  | "custom";

export type KanbanDueFilterState = {
  preset: KanbanDueFilterPreset | null;
  from: string | null;
  to: string | null;
};

export const EMPTY_KANBAN_DUE_FILTER: KanbanDueFilterState = {
  preset: null,
  from: null,
  to: null,
};

function startOfLocalDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Monday-start week (pt-BR). */
function startOfWeekMonday(date: Date) {
  const day = date.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
}

function endOfWeekMonday(date: Date) {
  const start = startOfWeekMonday(date);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
}

export function rangeForDueFilterPreset(
  preset: Exclude<KanbanDueFilterPreset, "custom" | "month">,
  now = new Date(),
): { from: string; to: string } {
  const today = startOfLocalDay(now);

  switch (preset) {
    case "today": {
      const iso = localDateToKanbanDueDate(today);
      return { from: iso, to: iso };
    }
    case "this_week": {
      return {
        from: localDateToKanbanDueDate(startOfWeekMonday(today)),
        to: localDateToKanbanDueDate(endOfWeekMonday(today)),
      };
    }
    case "this_month": {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return {
        from: localDateToKanbanDueDate(from),
        to: localDateToKanbanDueDate(to),
      };
    }
    case "last_month": {
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        from: localDateToKanbanDueDate(from),
        to: localDateToKanbanDueDate(to),
      };
    }
    default: {
      const _exhaustive: never = preset;
      return _exhaustive;
    }
  }
}

export function rangeForMonth(year: number, monthIndex: number): {
  from: string;
  to: string;
} {
  const from = new Date(year, monthIndex, 1);
  const to = new Date(year, monthIndex + 1, 0);
  return {
    from: localDateToKanbanDueDate(from),
    to: localDateToKanbanDueDate(to),
  };
}

/** True when the card's date range overlaps the filter window. */
export function cardMatchesDueFilter(
  startDate: string | null | undefined,
  dueDate: string | null | undefined,
  filter: KanbanDueFilterState,
): boolean {
  if (!filter.preset || !filter.from || !filter.to) return true;

  const cardStart = formatKanbanDueDateInput(startDate ?? dueDate);
  const cardEnd = formatKanbanDueDateInput(dueDate ?? startDate);
  if (!cardStart && !cardEnd) return false;

  const from = cardStart || cardEnd;
  const to = cardEnd || cardStart;
  return from <= filter.to && to >= filter.from;
}

export function formatDueFilterLabel(filter: KanbanDueFilterState): string | null {
  if (!filter.preset || !filter.from || !filter.to) return null;

  switch (filter.preset) {
    case "today":
      return "Hoje";
    case "this_week":
      return "Esta semana";
    case "this_month":
      return "Este mês";
    case "last_month":
      return "Mês passado";
    case "month": {
      const date = kanbanDueDateToLocalDate(filter.from);
      if (!date) return "Mês";
      return date.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
    }
    case "custom":
      return formatKanbanDueDateLabel(filter.from, filter.to);
    default: {
      const _exhaustive: never = filter.preset;
      return _exhaustive;
    }
  }
}
