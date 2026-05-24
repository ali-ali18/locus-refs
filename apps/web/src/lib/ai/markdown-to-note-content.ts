"use client";

import type { JSONContent } from "@tiptap/core";
import { generateJSON } from "@tiptap/html";
import { getNotesEditorExtensions } from "@/lib/notes-editor-config";
import { markdownToHtml } from "./markdown-to-html";

export function markdownToNoteContent(markdown: string): JSONContent[] {
  const html = markdownToHtml(markdown);
  const json = generateJSON(html, getNotesEditorExtensions()) as JSONContent;

  return json.content ?? [];
}
