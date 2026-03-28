import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { common, createLowlight } from "lowlight";
import { CodeBlockView } from "@/components/ui/baseNote/codeBlock/CodeBlockView";

const lowlight = createLowlight(common);

export const CustomCodeBlock = CodeBlockLowlight.extend({
  name: "codeBlockCustom",

  addOptions() {
    return {
      ...this.parent?.(),
      lowlight,
      defaultLanguage: "typescript",
      enableTabIndentation: true,
      languageClassPrefix: `language-${this.name}`,
      exitOnTripleEnter: true,
      exitOnArrowDown: true,
      tabSize: 2,
      HTMLAttributes: {
        ...this.parent?.().HTMLAttributes,
      },
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      title: {
        default: "Nome do arquivo",
        parseHTML: (el) => el.getAttribute("data-title"),
        renderHTML: (attrs) => ({ "data-title": attrs.title }),
      },
      language: {
        default: "typescript",
        parseHTML: (el) => el.getAttribute("data-language"),
        renderHTML: (attrs) => ({ "data-language": attrs.language }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView, {
      stopEvent: () => true,
    });
  },
});
