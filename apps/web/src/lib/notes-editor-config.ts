import type { HocuspocusProvider } from "@hocuspocus/provider";
import { Collaboration } from "@tiptap/extension-collaboration";
import { CollaborationCaret } from "@tiptap/extension-collaboration-caret";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { BackgroundColor, Color } from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import type * as Y from "yjs";
import type {
  SlashMenuConfig,
  SlashMenuItemType,
} from "@/components/tiptap-ui/slash-dropdown-menu/use-slash-dropdown-menu";
import { CustomCodeBlock } from "@/lib/extension/CustomCodeBlock";
import { CustomTextStyle } from "@/lib/extension/CustomTextStyle";
import { ImageUpload } from "@/lib/extension/ImageUpload";
import { RoadmapBlock } from "@/lib/extension/RoadmapBlock";
import { CustomCode } from "./extension/CustomCode";
import { CustomTaskItem } from "./extension/CustomTaskItem";
import { CustomTaskList } from "./extension/CustomTaskList";

const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level;
    const classes: Record<number, string> = {
      1: "text-3xl font-bold text-accent-foreground leading-tight",
      2: "text-2xl font-semibold text-accent-foreground leading-snug",
      3: "text-xl font-medium text-accent-foreground leading-snug",
    };
    return [`h${level}`, { ...HTMLAttributes, class: classes[level] }, 0];
  },
});

export const NOTES_EDITOR_PLACEHOLDER =
  "Digite ' / ' para abrir o menu de atalhos e ' : ' para abrir o menu de emojis...";

export interface CollabUser {
  name: string;
  color: string;
  image?: string | null;
}

export interface NotesEditorExtensionsOptions {
  placeholder?: string;
  uploadImage?: (file: File) => Promise<string>;
  ydoc?: Y.Doc;
  provider?: HocuspocusProvider;
  user?: CollabUser;
}

function renderCaretLabel(user: CollabUser): HTMLElement {
  // Cursor line — position:relative so the label can float above via position:absolute
  const cursor = document.createElement("span");
  cursor.style.cssText = `border-left:2px solid ${user.color};margin-left:-1px;pointer-events:none;position:relative;word-break:normal;`;

  // Floating bubble label — bottom:100% places it above the cursor without affecting text flow
  const label = document.createElement("span");
  label.style.cssText = `position:absolute;bottom:100%;left:-1px;display:inline-flex;align-items:center;gap:4px;border-radius:12px 12px 12px 0;padding:2px 8px 2px 4px;font-size:11px;font-weight:600;color:#fff;white-space:nowrap;pointer-events:none;box-shadow:0 2px 6px rgba(0,0,0,0.2);z-index:50;animation:collab-caret-fade-in 0.2s ease-out;background-color:${user.color};`;

  const avatar = document.createElement("span");
  avatar.style.cssText =
    "width:16px;height:16px;border-radius:50%;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.25);font-size:9px;font-weight:700;";

  if (user.image) {
    const img = document.createElement("img");
    img.src = user.image;
    img.style.cssText =
      "width:100%;height:100%;object-fit:cover;border-radius:50%;";
    img.onerror = () => {
      img.replaceWith(
        document.createTextNode(user.name.charAt(0).toUpperCase()),
      );
    };
    avatar.appendChild(img);
  } else {
    avatar.appendChild(
      document.createTextNode(user.name.charAt(0).toUpperCase()),
    );
  }

  const name = document.createElement("span");
  name.textContent = user.name;
  name.style.cssText =
    "max-width:100px;overflow:hidden;text-overflow:ellipsis;";

  label.appendChild(avatar);
  label.appendChild(name);
  cursor.appendChild(label);
  return cursor;
}

export function getNotesEditorExtensions(
  options: NotesEditorExtensionsOptions = {},
) {
  const placeholder = options.placeholder ?? NOTES_EDITOR_PLACEHOLDER;
  const uploadImage = options.uploadImage ?? (() => Promise.resolve(""));
  const { ydoc, provider, user } = options;

  return [
    StarterKit.configure({
      heading: false,
      ...(ydoc && { history: false }),
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
      code: false,
      link: false,
    }),
    CustomCode.configure({
      HTMLAttributes: {
        class:
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      },
    }),
    CustomCodeBlock,

    ImageUpload.configure({ uploadImage }),

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
    }),

    CustomTaskList,
    CustomTaskItem.configure({ nested: true }),

    RoadmapBlock,

    CustomTextStyle,
    Color,
    BackgroundColor,

    Placeholder.configure({
      placeholder: () => placeholder,
      showOnlyCurrent: false,
      includeChildren: true,
      emptyEditorClass: "is-editor-empty",
    }),

    ...(ydoc ? [Collaboration.configure({ document: ydoc })] : []),
    ...(provider && user
      ? [
          CollaborationCaret.configure({
            provider,
            user,
            render: (u) => renderCaretLabel(u as CollabUser),
          }),
        ]
      : []),
  ];
}

export const NOTES_EDITOR_PROPS = {
  attributes: {
    class:
      "focus:outline-none min-h-[200px] px-1 py-2 space-y-4 overflow-x-hidden overflow-y-hidden",
  },
};

const NOTES_SLASH_ENABLED_ITEMS: SlashMenuItemType[] = [
  "text",
  "heading_1",
  "heading_2",
  "heading_3",
  "bullet_list",
  "ordered_list",
  "task_list",
  "quote",
  "code_block",
  "divider",
];

export function getNotesSlashMenuConfig(
  onOpenImageDialog: () => void,
): SlashMenuConfig {
  return {
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
      {
        title: "Imagem",
        subtext: "Upload de arquivo de imagem",
        keywords: ["imagem", "foto", "image", "photo", "upload", "picture"],
        group: "Blocos",
        onSelect: () => {
          onOpenImageDialog();
        },
      },
      {
        title: "Roadmap",
        subtext: "Kanban, Calendário e Gantt em um bloco",
        keywords: ["roadmap", "kanban", "gantt", "calendario", "board"],
        group: "Blocos",
        onSelect: ({ editor }) => {
          editor.chain().focus().insertContent({ type: "roadmapBlock" }).run();
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
      task_list: "Listas",
      quote: "Blocos",
      code_block: "Blocos",
      divider: "Separadores",
    },
  };
}
