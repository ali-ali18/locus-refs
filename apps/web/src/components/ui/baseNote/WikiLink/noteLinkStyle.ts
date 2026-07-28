import type { Editor } from "@tiptap/react";
import type { CSSProperties } from "react";
import { BACKGROUND_COLORS, TEXT_COLORS } from "@/lib/data/colorsNote";

export const DEFAULT_NOTE_LINK_COLOR = TEXT_COLORS[0].value;
export const DEFAULT_NOTE_LINK_BACKGROUND = BACKGROUND_COLORS[0].value;

export type NoteLinkStyleAttrs = {
  color: string | null;
  backgroundColor: string | null;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
};

export function isNoteLinkSelected(editor: Editor): boolean {
  return editor.isActive("noteLink");
}

export function getSelectedNoteLinkStyle(
  editor: Editor,
): Partial<NoteLinkStyleAttrs> {
  if (!isNoteLinkSelected(editor)) return {};
  return editor.getAttributes("noteLink") as Partial<NoteLinkStyleAttrs>;
}

export function updateSelectedNoteLinkStyle(
  editor: Editor,
  attrs: Partial<NoteLinkStyleAttrs>,
): boolean {
  if (!isNoteLinkSelected(editor)) return false;
  return editor.chain().focus().updateAttributes("noteLink", attrs).run();
}

export function toggleSelectedNoteLinkFlag(
  editor: Editor,
  key: "bold" | "italic" | "underline" | "strike",
): boolean {
  if (!isNoteLinkSelected(editor)) return false;
  const current = Boolean(editor.getAttributes("noteLink")[key]);
  return updateSelectedNoteLinkStyle(editor, { [key]: !current });
}

export function noteLinkStyleToCss(
  attrs: Partial<NoteLinkStyleAttrs>,
): CSSProperties {
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    verticalAlign: "baseline",
    lineHeight: 1.25,
  };

  if (attrs.bold) style.fontWeight = 700;
  if (attrs.italic) style.fontStyle = "italic";

  const decorations: string[] = [];
  if (attrs.underline) decorations.push("underline");
  if (attrs.strike) decorations.push("line-through");
  if (decorations.length) {
    style.textDecorationLine = decorations.join(" ");
    style.textDecorationThickness = "1.5px";
    style.textUnderlineOffset = "2px";
  }

  if (typeof attrs.color === "string" && attrs.color.trim()) {
    style.color = attrs.color;
  }
  if (
    typeof attrs.backgroundColor === "string" &&
    attrs.backgroundColor.trim()
  ) {
    style.backgroundColor = attrs.backgroundColor;
  }

  return style;
}

export function noteLinkStyleToCssString(
  attrs: Partial<NoteLinkStyleAttrs>,
): string {
  const style = noteLinkStyleToCss(attrs);
  return Object.entries(style)
    .filter(([, value]) => value != null && value !== "")
    .map(([key, value]) => {
      const cssKey = key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
      return `${cssKey}: ${value}`;
    })
    .join("; ");
}
