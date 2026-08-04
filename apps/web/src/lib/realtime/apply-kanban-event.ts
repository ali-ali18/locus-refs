import type {
  KanbanBoardDetail,
  KanbanCard,
  KanbanColumn,
  KanbanRealtimeEvent,
} from "@refstash/shared";

export function applyKanbanRealtimeEvent(
  board: KanbanBoardDetail,
  event: KanbanRealtimeEvent,
  options?: { draggingCardId?: string | null },
): KanbanBoardDetail | null {
  if (event.boardId !== board.id) return board;

  switch (event.type) {
    case "card.created":
    case "card.updated":
    case "card.moved": {
      if (
        options?.draggingCardId &&
        options.draggingCardId === event.payload.id
      ) {
        return board;
      }
      const existing = board.cards.find((c) => c.id === event.payload.id);
      const nextCard: KanbanCard = {
        id: event.payload.id,
        boardId: event.boardId,
        columnId: event.payload.columnId,
        title: event.payload.title,
        description: event.payload.description,
        position: event.payload.position,
        startDate: event.payload.startDate,
        dueDate: event.payload.dueDate,
        assigneeId: event.payload.assigneeId,
        createdById: existing?.createdById ?? event.actorId,
        createdAt: existing?.createdAt ?? event.at,
        updatedAt: event.at,
        createdBy: existing?.createdBy,
        assignee:
          existing?.assigneeId === event.payload.assigneeId
            ? existing?.assignee
            : event.payload.assigneeId
              ? undefined
              : null,
      };
      const without = board.cards.filter((c) => c.id !== nextCard.id);
      return { ...board, cards: [...without, nextCard] };
    }
    case "card.deleted":
      return {
        ...board,
        cards: board.cards.filter((c) => c.id !== event.payload.id),
      };
    case "column.created":
    case "column.updated": {
      const nextColumn: KanbanColumn = {
        id: event.payload.id,
        boardId: event.boardId,
        name: event.payload.name,
        color: event.payload.color,
        position: event.payload.position,
        createdAt:
          board.columns.find((c) => c.id === event.payload.id)?.createdAt ??
          event.at,
        updatedAt: event.at,
      };
      const without = board.columns.filter((c) => c.id !== nextColumn.id);
      return { ...board, columns: [...without, nextColumn] };
    }
    case "column.deleted":
      return {
        ...board,
        columns: board.columns.filter((c) => c.id !== event.payload.id),
        cards: board.cards.filter((c) => c.columnId !== event.payload.id),
      };
    case "board.updated":
      return {
        ...board,
        title: event.payload.title,
        description: event.payload.description,
        icon: event.payload.icon,
        updatedAt: event.at,
      };
    case "board.deleted":
      return null;
    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}
