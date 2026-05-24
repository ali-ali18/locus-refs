export interface NoteContent {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: NoteContent[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
}

export const EMPTY_NOTE_CONTENT: NoteContent = { type: "doc", content: [] };

export interface Note {
  id: string;
  title: string;
  icon: string | null;
  content?: NoteContent | null;
  collectionId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
