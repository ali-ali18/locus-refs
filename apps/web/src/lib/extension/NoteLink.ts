import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {
  noteLinkStyleToCssString,
  type NoteLinkStyleAttrs,
} from "@/components/ui/baseNote/WikiLink/noteLinkStyle";
import { NoteLinkView } from "@/components/ui/baseNote/WikiLink/NoteLinkView";

function boolAttr(name: string, dataAttr: string) {
  return {
    default: false,
    parseHTML: (element: HTMLElement) =>
      element.getAttribute(dataAttr) === "true",
    renderHTML: (attributes: Record<string, unknown>) =>
      attributes[name] ? { [dataAttr]: "true" } : {},
  };
}

function styleStringAttr(name: string, dataAttr: string) {
  return {
    default: null as string | null,
    parseHTML: (element: HTMLElement) => element.getAttribute(dataAttr),
    renderHTML: (attributes: Record<string, unknown>) =>
      typeof attributes[name] === "string" && attributes[name]
        ? { [dataAttr]: attributes[name] as string }
        : {},
  };
}

export const NoteLink = Node.create({
  name: "noteLink",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  // Estilos vivem em attrs (persistem com collab/Yjs). Marks em atom quebram.
  marks: "",

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) =>
          attributes.id ? { "data-id": attributes.id } : {},
      },
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title") ?? "",
        renderHTML: (attributes) =>
          attributes.title ? { "data-title": attributes.title } : {},
      },
      icon: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-icon"),
        renderHTML: (attributes) =>
          attributes.icon ? { "data-icon": attributes.icon } : {},
      },
      color: styleStringAttr("color", "data-color"),
      backgroundColor: styleStringAttr("backgroundColor", "data-bg"),
      bold: boolAttr("bold", "data-bold"),
      italic: boolAttr("italic", "data-italic"),
      underline: boolAttr("underline", "data-underline"),
      strike: boolAttr("strike", "data-strike"),
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="note-link"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const styleAttrs: Partial<NoteLinkStyleAttrs> = {
      color: node.attrs.color,
      backgroundColor: node.attrs.backgroundColor,
      bold: Boolean(node.attrs.bold),
      italic: Boolean(node.attrs.italic),
      underline: Boolean(node.attrs.underline),
      strike: Boolean(node.attrs.strike),
    };

    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-type": "note-link",
        class:
          "inline-flex items-center gap-1.5 align-baseline mx-0.5 max-w-[14rem] rounded-none px-1.5 py-0.5 text-[1em] leading-none font-medium tracking-tight",
        style: noteLinkStyleToCssString(styleAttrs),
      }),
      node.attrs.title || "Nota",
    ];
  },

  addKeyboardShortcuts() {
    const toggle = (key: "bold" | "italic" | "underline") => {
      return () => {
        if (!this.editor.isActive("noteLink")) return false;
        const current = Boolean(this.editor.getAttributes("noteLink")[key]);
        return this.editor
          .chain()
          .focus()
          .updateAttributes("noteLink", { [key]: !current })
          .run();
      };
    };

    return {
      "Mod-b": toggle("bold"),
      "Mod-i": toggle("italic"),
      "Mod-u": toggle("underline"),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(NoteLinkView, {
      as: "span",
    });
  },
});
