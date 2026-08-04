import type { KanbanRealtimeEvent } from "@refstash/shared";
import { formatKanbanDueDateInput } from "@/lib/kanban/due-date";

type CardRow = {
  id: string;
  columnId: string;
  title: string;
  description: string | null;
  position: number;
  startDate: Date | string | null;
  dueDate: Date | string | null;
  assigneeId: string | null;
};

type ColumnRow = {
  id: string;
  name: string;
  color: string | null;
  position: number;
};

function base(
  boardId: string,
  workspaceId: string,
  actorId: string,
): Pick<KanbanRealtimeEvent, "boardId" | "workspaceId" | "actorId" | "at"> {
  return {
    boardId,
    workspaceId,
    actorId,
    at: new Date().toISOString(),
  };
}

function cardPayload(card: CardRow) {
  return {
    id: card.id,
    columnId: card.columnId,
    title: card.title,
    description: card.description,
    position: card.position,
    startDate: formatKanbanDueDateInput(card.startDate) || null,
    dueDate: formatKanbanDueDateInput(card.dueDate) || null,
    assigneeId: card.assigneeId,
  };
}

export function cardCreatedEvent(
  boardId: string,
  workspaceId: string,
  actorId: string,
  card: CardRow,
): KanbanRealtimeEvent {
  return {
    ...base(boardId, workspaceId, actorId),
    type: "card.created",
    payload: cardPayload(card),
  };
}

export function cardUpdatedEvent(
  boardId: string,
  workspaceId: string,
  actorId: string,
  card: CardRow,
  moved: boolean,
): KanbanRealtimeEvent {
  return {
    ...base(boardId, workspaceId, actorId),
    type: moved ? "card.moved" : "card.updated",
    payload: cardPayload(card),
  };
}

export function cardDeletedEvent(
  boardId: string,
  workspaceId: string,
  actorId: string,
  cardId: string,
): KanbanRealtimeEvent {
  return {
    ...base(boardId, workspaceId, actorId),
    type: "card.deleted",
    payload: { id: cardId },
  };
}

export function columnCreatedEvent(
  boardId: string,
  workspaceId: string,
  actorId: string,
  column: ColumnRow,
): KanbanRealtimeEvent {
  return {
    ...base(boardId, workspaceId, actorId),
    type: "column.created",
    payload: {
      id: column.id,
      name: column.name,
      color: column.color,
      position: column.position,
    },
  };
}

export function columnUpdatedEvent(
  boardId: string,
  workspaceId: string,
  actorId: string,
  column: ColumnRow,
): KanbanRealtimeEvent {
  return {
    ...base(boardId, workspaceId, actorId),
    type: "column.updated",
    payload: {
      id: column.id,
      name: column.name,
      color: column.color,
      position: column.position,
    },
  };
}

export function columnDeletedEvent(
  boardId: string,
  workspaceId: string,
  actorId: string,
  columnId: string,
): KanbanRealtimeEvent {
  return {
    ...base(boardId, workspaceId, actorId),
    type: "column.deleted",
    payload: { id: columnId },
  };
}

export function boardUpdatedEvent(
  boardId: string,
  workspaceId: string,
  actorId: string,
  board: {
    title: string;
    description: string | null;
    icon: string | null;
  },
): KanbanRealtimeEvent {
  return {
    ...base(boardId, workspaceId, actorId),
    type: "board.updated",
    payload: {
      title: board.title,
      description: board.description,
      icon: board.icon,
    },
  };
}

export function boardDeletedEvent(
  boardId: string,
  workspaceId: string,
  actorId: string,
): KanbanRealtimeEvent {
  return {
    ...base(boardId, workspaceId, actorId),
    type: "board.deleted",
    payload: { id: boardId },
  };
}
