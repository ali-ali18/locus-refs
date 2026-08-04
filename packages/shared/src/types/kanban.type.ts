export interface KanbanUserSummary {
  id: string;
  name: string;
  image: string | null;
}

export interface KanbanBoard {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  workspaceId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  lastOpenedAt: string | null;
}

export interface KanbanColumn {
  id: string;
  boardId: string;
  name: string;
  color: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanCard {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string | null;
  position: number;
  startDate: string | null;
  dueDate: string | null;
  createdById: string;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: KanbanUserSummary;
  assignee?: KanbanUserSummary | null;
}

export interface KanbanBoardDetail extends KanbanBoard {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  createdBy?: KanbanUserSummary;
}
