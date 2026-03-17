import {
  Bold,
  BrushIcon,
  CodeSimpleIcon,
  Italic,
  LeftToRightListDashIcon,
  LeftToRightListNumberIcon,
  LinkCircle02Icon,
  PaintBucketIcon,
  SourceCodeSquareIcon,
  Underline,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { Editor } from "@tiptap/react";
import { BACKGROUND_COLORS, TEXT_COLORS } from "@/lib/data/colorsNote";

export type MenuItemAction = {
  kind: "action";
  label: string;
  mark?: string;
  icon?: IconSvgElement;
  onSelect: (editor: Editor) => void;
};

export type MenuItemSubmenu = {
  kind: "submenu";
  label: string;
  icon?: IconSvgElement;
  children: (MenuItemAction | MenuItemColor)[];
};

export interface MenuItemSeparator {
  kind: "separator";
}

export type MenuItemColor = {
  kind: "color";
  label: string;
  value: string;
  onSelect: (editor: Editor) => void;
};

export type MenuItem =
  | MenuItemAction
  | MenuItemSubmenu
  | MenuItemSeparator
  | MenuItemColor;

export type MenuGroup = {
  label?: string;
  items: MenuItem[];
};

export const BUBBLE_MENU_GROUPS: MenuGroup[] = [
  {
    label: "Estilo",
    items: [
      {
        kind: "action",
        label: "Bold",
        mark: "bold",
        icon: Bold,
        onSelect: (editor) => {
          editor.chain().focus().toggleBold().run();
        },
      },
      {
        kind: "action",
        label: "Italic",
        mark: "italic",
        icon: Italic,
        onSelect: (editor) => {
          editor.chain().focus().toggleItalic().run();
        },
      },
      {
        kind: "action",
        label: "Underline",
        mark: "underline",
        icon: Underline,
        onSelect: (editor) => {
          editor.chain().focus().toggleUnderline().run();
        },
      },
    ],
  },
  {
    items: [
      {
        kind: "separator",
      },
    ],
  },
  {
    label: "Coloração",
    items: [
      {
        kind: "submenu",
        label: "Cor do texto",
        icon: BrushIcon,
        children: [
          {
            kind: "color",
            label: "Padrão",
            value: "",
            onSelect: (editor) => {
              editor.chain().focus().unsetColor().run();
            },
          },
          ...TEXT_COLORS.map((color) => ({
            kind: "color" as const,
            label: color.label,
            value: color.value,
            onSelect: (editor: Editor) => {
              editor.chain().focus().setColor(color.value).run();
            },
          })),
        ],
      },
      {
        kind: "submenu",
        label: "Cor de fundo",
        icon: PaintBucketIcon,
        children: [
          {
            kind: "color",
            label: "Padrão",
            value: "",
            onSelect: (editor) => {
              editor.chain().focus().unsetBackgroundColor().run();
            },
          },
          ...BACKGROUND_COLORS.map((color) => ({
            kind: "color" as const,
            label: color.label,
            value: color.value,
            onSelect: (editor: Editor) => {
              editor.chain().focus().setBackgroundColor(color.value).run();
            },
          })),
        ],
      },
    ],
  },
  {
    items: [
      {
        kind: "separator",
      },
    ],
  },
  {
    label: "Listas",
    items: [
      {
        kind: "action",
        label: "Lista com marcadores",
        mark: "bulletList",
        icon: LeftToRightListDashIcon,
        onSelect: (editor) => {
          editor.chain().focus().toggleBulletList().run();
        },
      },
      {
        kind: "action",
        label: "Lista numerada",
        mark: "orderedList",
        icon: LeftToRightListNumberIcon,
        onSelect: (editor) => {
          editor.chain().focus().toggleOrderedList().run();
        },
      },
    ],
  },
  {
    label: "Links",
    items: [
      {
        kind: "action",
        label: "Link para notas",
        icon: LinkCircle02Icon,
        onSelect: (editor) => {
          console.log("Link para outra página", editor);
        },
      },
    ],
  },
  {
    items: [
      {
        kind: "separator",
      },
    ],
  },
  {
    label: "Código",
    items: [
      {
        kind: "action",
        label: "Bloco de código",
        icon: SourceCodeSquareIcon,
        onSelect: (editor) => {
          editor.chain().focus().setNode("codeBlockCustom").run();
        },
      },
      {
        kind: "action",
        label: "Código inline",
        mark: "code",
        icon: CodeSimpleIcon,
        onSelect: (editor) => {
          editor.chain().focus().toggleCode().run();
        },
      },
    ],
  },
];

export const BUBBLE_MENU_ITEMS: MenuItem[] = BUBBLE_MENU_GROUPS.flatMap(
  (group) => group.items,
);

const PRIMARY_ACTION_LABELS = ["Bold", "Italic", "Underline"] as const;

export const PRIMARY_ACTIONS: MenuItemAction[] = BUBBLE_MENU_GROUPS.flatMap(
  (group) => group.items,
).filter(
  (item): item is MenuItemAction =>
    item.kind === "action" &&
    PRIMARY_ACTION_LABELS.includes(
      item.label as (typeof PRIMARY_ACTION_LABELS)[number],
    ),
);
