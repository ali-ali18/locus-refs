import type { JSONContent } from "@tiptap/core";
import type { Editor } from "@tiptap/react";

interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface TiptapNode extends JSONContent {
  marks?: TiptapMark[];
}

/** Markup comum em apps de mensagem (*negrito*, _itálico_, ~riscado~, ```mono```). */
function stripEmojis(text: string): string {
  return text
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\uFE0F/g, "")
    .replace(/\u200D/g, "");
}

function wrapMessageMarks(
  text: string,
  marks: TiptapMark[] | undefined,
): string {
  if (!text || !marks?.length) return stripEmojis(text);

  const cleaned = stripEmojis(text);
  const leading = cleaned.match(/^\s*/)?.[0] ?? "";
  const trailing = cleaned.match(/\s*$/)?.[0] ?? "";
  const core = cleaned.slice(leading.length, cleaned.length - trailing.length);
  if (!core) return cleaned;

  let result = core;
  const types = new Set(marks.map((mark) => mark.type));

  if (types.has("code")) {
    return `${leading}\`\`\`${result}\`\`\`${trailing}`;
  }

  if (types.has("strike")) {
    result = `~${result}~`;
  }
  if (types.has("bold")) {
    result = `*${result}*`;
  }
  if (types.has("italic")) {
    result = `_${result}_`;
  }

  const link = marks.find((mark) => mark.type === "link");
  const href = typeof link?.attrs?.href === "string" ? link.attrs.href : null;
  if (href) {
    const label = result.trim();
    if (!label || label === href) return `${leading}${href}${trailing}`;
    return `${leading}${label} (${href})${trailing}`;
  }

  return `${leading}${result}${trailing}`;
}

function walkInline(nodes: TiptapNode[] | undefined): string {
  if (!nodes?.length) return "";
  return nodes
    .map((node) => {
      if (node.type === "hardBreak") return "\n";
      if (node.type === "emoji") return "";
      if (node.type === "text") {
        return wrapMessageMarks(node.text ?? "", node.marks);
      }
      return walkInline(node.content as TiptapNode[] | undefined);
    })
    .join("");
}

function walkListItems(
  nodes: TiptapNode[] | undefined,
  ordered: boolean,
): string {
  if (!nodes?.length) return "";

  return nodes
    .map((node, index) => {
      if (node.type === "listItem" || node.type === "taskItem") {
        const prefix =
          node.type === "taskItem"
            ? node.attrs?.checked
              ? "✅ "
              : "☐ "
            : ordered
              ? `${index + 1}. `
              : "- ";

        const parts = (node.content as TiptapNode[] | undefined)?.map(
          (child) => {
            if (child.type === "paragraph") {
              return walkInline(child.content as TiptapNode[] | undefined);
            }
            if (child.type === "bulletList") {
              return walkListItems(
                child.content as TiptapNode[] | undefined,
                false,
              )
                .split("\n")
                .map((line) => (line ? `  ${line}` : line))
                .join("\n");
            }
            if (child.type === "orderedList") {
              return walkListItems(
                child.content as TiptapNode[] | undefined,
                true,
              )
                .split("\n")
                .map((line) => (line ? `  ${line}` : line))
                .join("\n");
            }
            return walkNode(child);
          },
        );

        const body = (parts ?? []).filter(Boolean).join("\n");
        const [first, ...rest] = body.split("\n");
        const head = `${prefix}${first ?? ""}`;
        if (rest.length === 0) return head;
        return [head, ...rest.map((line) => `  ${line}`)].join("\n");
      }
      return walkNode(node);
    })
    .filter(Boolean)
    .join("\n");
}

function walkNode(node: TiptapNode): string {
  switch (node.type) {
    case "doc":
      return (
        (node.content as TiptapNode[] | undefined)
          ?.map(walkNode)
          .filter((block) => block.length > 0)
          .join("\n\n")
          .trim() ?? ""
      );
    case "paragraph":
      return walkInline(node.content as TiptapNode[] | undefined);
    case "heading":
      return wrapMessageMarks(
        walkInline(node.content as TiptapNode[] | undefined),
        [{ type: "bold" }],
      );
    case "bulletList":
    case "taskList":
      return walkListItems(node.content as TiptapNode[] | undefined, false);
    case "orderedList":
      return walkListItems(node.content as TiptapNode[] | undefined, true);
    case "blockquote":
      return (
        (node.content as TiptapNode[] | undefined)
          ?.map(walkNode)
          .filter(Boolean)
          .join("\n") ?? ""
      );
    case "codeBlock":
    case "codeBlockCustom": {
      const code = walkInline(node.content as TiptapNode[] | undefined);
      return `\`\`\`\n${code}\n\`\`\``;
    }
    case "horizontalRule":
      return "---";
    case "image": {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      return src || "";
    }
    case "hardBreak":
      return "\n";
    case "text":
      return wrapMessageMarks(node.text ?? "", node.marks);
    case "emoji":
      return "";
    case "noteLink": {
      const title =
        typeof node.attrs?.title === "string" ? node.attrs.title : "Nota";
      return title;
    }
    default:
      if (node.content) {
        return (node.content as TiptapNode[])
          .map(walkNode)
          .filter(Boolean)
          .join("\n");
      }
      return "";
  }
}

export function noteJsonToMessageText(doc: JSONContent): string {
  return walkNode(doc as TiptapNode).trim();
}

export function selectionToMessageText(editor: Editor): string {
  const { from, to, empty } = editor.state.selection;
  if (empty) return "";

  const slice = editor.state.doc.slice(from, to);
  const content: JSONContent[] = [];
  slice.content.forEach((node) => {
    content.push(node.toJSON() as JSONContent);
  });

  if (content.length === 0) return "";

  return noteJsonToMessageText({ type: "doc", content });
}
