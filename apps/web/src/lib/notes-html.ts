import type { JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";
import { getNotesEditorExtensions } from "./notes-editor-config";

export function noteJsonToHtml(json: JSONContent): string {
  return generateHTML(json, getNotesEditorExtensions());
}
