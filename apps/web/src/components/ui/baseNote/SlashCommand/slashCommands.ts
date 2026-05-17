import {
  CheckListIcon,
  CodeSimpleIcon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  Image01Icon,
  KanbanIcon,
  LeftToRightListDashIcon,
  LeftToRightListNumberIcon,
  QuoteDownIcon,
  SolidLine01Icon,
  SourceCodeSquareIcon,
  TextIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { Editor, Range } from "@tiptap/react";

export interface SlashCommandItem {
  id: string;
  title: string;
  subtext?: string;
  keywords?: string[];
  group: string;
  icon?: IconSvgElement;
  onSelect: (ctx: { editor: Editor; range: Range }) => void;
}

export function buildSlashCommands(
  onOpenImageDialog: () => void,
): SlashCommandItem[] {
  return [
    // Formatação
    {
      id: "text",
      title: "Texto",
      subtext: "Parágrafo de texto simples",
      keywords: ["p", "paragrafo", "texto", "text", "paragraph"],
      group: "Formatação",
      icon: TextIcon,
      onSelect: ({ editor }) => editor.chain().focus().setParagraph().run(),
    },
    {
      id: "heading_1",
      title: "Título 1",
      subtext: "Cabeçalho principal",
      keywords: ["h1", "heading1", "titulo", "heading"],
      group: "Formatação",
      icon: Heading01Icon,
      onSelect: ({ editor }) =>
        editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      id: "heading_2",
      title: "Título 2",
      subtext: "Cabeçalho secundário",
      keywords: ["h2", "heading2", "subtitulo"],
      group: "Formatação",
      icon: Heading02Icon,
      onSelect: ({ editor }) =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      id: "heading_3",
      title: "Título 3",
      subtext: "Cabeçalho terciário",
      keywords: ["h3", "heading3"],
      group: "Formatação",
      icon: Heading03Icon,
      onSelect: ({ editor }) =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    // Listas
    {
      id: "bullet_list",
      title: "Lista com marcadores",
      subtext: "Lista com itens não ordenados",
      keywords: ["ul", "li", "lista", "bullets", "bulletlist"],
      group: "Listas",
      icon: LeftToRightListDashIcon,
      onSelect: ({ editor }) => editor.chain().focus().toggleBulletList().run(),
    },
    {
      id: "ordered_list",
      title: "Lista numerada",
      subtext: "Lista com itens numerados",
      keywords: ["ol", "numbered", "numerada", "orderedlist"],
      group: "Listas",
      icon: LeftToRightListNumberIcon,
      onSelect: ({ editor }) =>
        editor.chain().focus().toggleOrderedList().run(),
    },
    {
      id: "task_list",
      title: "Lista de tarefas",
      subtext: "Lista com checkboxes",
      keywords: ["todo", "checklist", "tasks", "tarefas", "tasklist"],
      group: "Listas",
      icon: CheckListIcon,
      onSelect: ({ editor }) => editor.chain().focus().toggleTaskList().run(),
    },
    // Blocos
    {
      id: "quote",
      title: "Citação",
      subtext: "Bloco de citação",
      keywords: ["quote", "blockquote", "citacao"],
      group: "Blocos",
      icon: QuoteDownIcon,
      onSelect: ({ editor }) => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      id: "code_block",
      title: "Bloco de código",
      subtext: "Bloco de código com realce de sintaxe",
      keywords: ["code", "codeblock", "codigo", "pre"],
      group: "Blocos",
      icon: SourceCodeSquareIcon,
      onSelect: ({ editor }) =>
        editor.chain().focus().setNode("codeBlockCustom").run(),
    },
    {
      id: "inline_code",
      title: "Código inline",
      subtext: "Código dentro de uma linha de texto",
      keywords: ["code", "inline", "codigo"],
      group: "Blocos",
      icon: CodeSimpleIcon,
      onSelect: ({ editor }) => editor.chain().focus().toggleCode().run(),
    },
    {
      id: "roadmap",
      title: "Roadmap",
      subtext: "Kanban, Calendário e Gantt em um bloco",
      keywords: ["roadmap", "kanban", "gantt", "calendario", "board"],
      group: "Blocos",
      icon: KanbanIcon,
      onSelect: ({ editor }) =>
        editor.chain().focus().insertContent({ type: "roadmapBlock" }).run(),
    },
    // Separadores
    {
      id: "divider",
      title: "Separador",
      subtext: "Linha horizontal para separar conteúdo",
      keywords: ["hr", "divider", "separador", "linha", "horizontal"],
      group: "Separadores",
      icon: SolidLine01Icon,
      onSelect: ({ editor }) =>
        editor.chain().focus().setHorizontalRule().run(),
    },
    // Mídia
    {
      id: "image",
      title: "Imagem",
      subtext: "Upload de arquivo de imagem",
      keywords: ["image", "imagem", "foto", "photo", "upload", "picture"],
      group: "Mídia",
      icon: Image01Icon,
      onSelect: () => onOpenImageDialog(),
    },
  ];
}

export function filterSlashCommands(
  items: SlashCommandItem[],
  query: string,
): SlashCommandItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtext?.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.toLowerCase().includes(q)),
    )
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      if (aTitle === q && bTitle !== q) return -1;
      if (bTitle === q && aTitle !== q) return 1;
      if (aTitle.startsWith(q) && !bTitle.startsWith(q)) return -1;
      if (bTitle.startsWith(q) && !aTitle.startsWith(q)) return 1;
      return 0;
    });
}
