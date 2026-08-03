export const DEFAULT_KANBAN_COLUMNS = [
  { name: "A fazer", color: "#94a3b8", position: 0 },
  { name: "Em andamento", color: "#3b82f6", position: 1 },
  { name: "Concluído", color: "#22c55e", position: 2 },
] as const;

export const kanbanUserSelect = {
  id: true,
  name: true,
  image: true,
} as const;

/** @deprecated use kanbanUserSelect */
export const kanbanCreatedBySelect = kanbanUserSelect;
