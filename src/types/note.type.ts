export interface Note {
  id: string;
  title: string;
  icon: string | null;
  content?: string | null;
  collectionId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
