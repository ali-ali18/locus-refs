export interface Board {
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
