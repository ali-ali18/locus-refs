export const KANBAN_EVENTS_CHANNEL = "kanban:events";

export function kanbanBoardRoom(boardId: string): string {
  return `board:${boardId}`;
}

type KanbanRealtimeBase = {
  boardId: string;
  workspaceId: string;
  actorId: string;
  at: string;
};

export type KanbanRealtimeEvent =
  | (KanbanRealtimeBase & {
      type: "card.created" | "card.updated" | "card.moved";
      payload: {
        id: string;
        columnId: string;
        title: string;
        description: string | null;
        position: number;
        startDate: string | null;
        dueDate: string | null;
        assigneeId: string | null;
      };
    })
  | (KanbanRealtimeBase & {
      type: "card.deleted";
      payload: { id: string };
    })
  | (KanbanRealtimeBase & {
      type: "column.created" | "column.updated";
      payload: {
        id: string;
        name: string;
        color: string | null;
        position: number;
      };
    })
  | (KanbanRealtimeBase & {
      type: "column.deleted";
      payload: { id: string };
    })
  | (KanbanRealtimeBase & {
      type: "board.updated";
      payload: {
        title: string;
        description: string | null;
        icon: string | null;
      };
    })
  | (KanbanRealtimeBase & {
      type: "board.deleted";
      payload: { id: string };
    });
