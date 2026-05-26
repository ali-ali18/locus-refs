export interface Collection {
  id: string;
  name: string;
  slug: string;
  userId: string;
  color: string | null;
  description: string | null;
  isNoteCollection: boolean;
  createdAt: string;
  updatedAt: string;
}
