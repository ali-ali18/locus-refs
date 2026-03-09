export interface Note {
  id: string;
  title: string;
  icon: string | null;
  content: string;
  collectionId: string | null;
  createdAt: string;
  updatedAt: string;
}
