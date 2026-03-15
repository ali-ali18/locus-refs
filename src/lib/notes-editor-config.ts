import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import type {
  SlashMenuConfig,
  SlashMenuItemType,
} from "@/components/tiptap-ui/slash-dropdown-menu/use-slash-dropdown-menu";
import { CustomCodeBlock } from "@/lib/extension/CustomCodeBlock";

const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level;
    const classes: Record<number, string> = {
      1: "text-3xl font-bold text-accent-foreground mt-8 mb-4 leading-tight",
      2: "text-2xl font-semibold text-accent-foreground mt-6 mb-3 leading-snug",
      3: "text-xl font-medium text-accent-foreground mt-4 mb-2 leading-snug",
    };
    return [`h${level}`, { ...HTMLAttributes, class: classes[level] }, 0];
  },
});

export const NOTES_EDITOR_PLACEHOLDER =
  "Digite ' / ' para abrir o menu de atalhos e ' : ' para abrir o menu de emojis...";

export interface NotesEditorExtensionsOptions {
  placeholder?: string;
}

export function getNotesEditorExtensions(
  options: NotesEditorExtensionsOptions = {},
) {
  const placeholder = options.placeholder ?? NOTES_EDITOR_PLACEHOLDER;

  return [
    StarterKit.configure({
      heading: false,
      paragraph: {
        HTMLAttributes: { class: "leading-7" },
      },
      blockquote: {
        HTMLAttributes: { class: "mt-6 border-l-4 pl-6 italic" },
      },
      bulletList: {
        HTMLAttributes: { class: "my-6 ml-6 list-disc [&>li]:mt-2" },
      },
      orderedList: {
        HTMLAttributes: { class: "my-6 ml-6 list-decimal [&>li]:mt-2" },
      },
      codeBlock: false,
      code: {
        HTMLAttributes: {
          class:
            "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        },
      },
    }),
    CustomCodeBlock,

    CustomHeading.configure({ levels: [1, 2, 3] }),
    Emoji.configure({
      emojis: gitHubEmojis,
      forceFallbackImages: false,
      HTMLAttributes: {
        class: "align-middle mx-[0.05em]",
      },
    }),

    Link.configure({
      autolink: true,
      openOnClick: false,
      HTMLAttributes: {
        class: "text-accent-foreground underline cursor-pointer",
      },
    }),

    Placeholder.configure({
      placeholder,
    }),
  ];
}

export const NOTES_EDITOR_PROPS = {
  attributes: {
    class: "focus:outline-none min-h-[200px] px-1 py-2",
  },
};

const NOTES_SLASH_ENABLED_ITEMS: SlashMenuItemType[] = [
  "text",
  "heading_1",
  "heading_2",
  "heading_3",
  "bullet_list",
  "ordered_list",
  "quote",
  "code_block",
];

export const NOTES_SLASH_MENU_CONFIG: SlashMenuConfig = {
  enabledItems: NOTES_SLASH_ENABLED_ITEMS,
  customItems: [
    {
      title: "Inline Code",
      onSelect: ({ editor }) => {
        editor.chain().focus().toggleCode().run();
      },
    },
    {
      title: "Code Block",
      onSelect: ({ editor }) => {
        editor.chain().focus().setNode("codeBlockCustom").run();
      },
    },
  ],
  showGroups: true,
  itemGroups: {
    text: "Formatação",
    heading_1: "Formatação",
    heading_2: "Formatação",
    heading_3: "Formatação",
    bullet_list: "Listas",
    ordered_list: "Listas",
    quote: "Blocos",
    code_block: "Blocos",
  },
};
