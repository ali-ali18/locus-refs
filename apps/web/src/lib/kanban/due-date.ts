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
