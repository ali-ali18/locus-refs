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
  /** Present when loaded for the current user. */
  isFavorite?: boolean;
}

export interface NotePinItem {
  id: string;
  title: string;
  icon: string | null;
  favoritedAt?: string | null;
  lastOpenedAt?: string | null;
  isFavorite?: boolean;
}

export interface NotePins {
  favorites: NotePinItem[];
  recents: NotePinItem[];
}
