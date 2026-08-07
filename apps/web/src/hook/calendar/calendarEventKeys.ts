export const calendarEventKeys = {
  all: (workspaceId: string) => ["calendar-events", workspaceId] as const,
  range: (workspaceId: string, from: string, to: string, visibility: string) =>
    [
      ...calendarEventKeys.all(workspaceId),
      "range",
      from,
      to,
      visibility,
    ] as const,
};
