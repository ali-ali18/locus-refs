interface TiptapNode {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
}

const walkBlock = (node: TiptapNode): string => {
  const walk = (n: TiptapNode): string => {
    if (n.type === "text") return n.text ?? "";
    const children = n.content?.map(walk) ?? [];
    switch (n.type) {
      case "paragraph":
        return children.join("");
      case "heading": {
        const level = (n.attrs?.level as number) ?? 1;
        return `${"#".repeat(level)} ${children.join("")}`;
      }
      case "bulletList":
      case "orderedList":
        return children.join("\n");
      case "listItem":
        return `• ${children.join("")}`;
      case "taskList":
        return children.join("\n");
      case "taskItem": {
        const checked = n.attrs?.checked ? "[x]" : "[ ]";
        return `${checked} ${children.join("")}`;
      }
      case "blockquote":
        return children.map((c) => `> ${c}`).join("\n");
      case "codeBlock":
      case "codeBlockCustom": {
        const lang = (n.attrs?.language as string) ?? "";
        return `\`\`\`${lang}\n${children.join("")}\n\`\`\``;
      }
      case "image":
        return `[image: ${n.attrs?.src ?? ""}]`;
      case "roadmapBlock":
        return "[roadmap block]";
      default:
        return children.join("");
    }
  };
  return walk(node);
};

export function noteJsonToEnumeratedText(doc: TiptapNode): string {
  const blocks = doc.content ?? [];
  if (blocks.length === 0) return "(nota vazia)";
  return blocks
    .map((block, index) => {
      const type = block.type ?? "unknown";
      const text = walkBlock(block).trim();
      return `[${index}] (${type}) ${text}`;
    })
    .join("\n\n");
}

export function noteJsonToText(doc: TiptapNode): string {
  const lines: string[] = [];

  const walk = (node: TiptapNode, depth = 0): string => {
    if (node.type === "text") return node.text ?? "";

    const children = node.content?.map((n) => walk(n, depth)) ?? [];

    switch (node.type) {
      case "doc":
        return children.join("\n\n").trim();
      case "paragraph":
        return children.join("");
      case "heading": {
        const level = (node.attrs?.level as number) ?? 1;
        const prefix = "#".repeat(level);
        return `${prefix} ${children.join("")}`;
      }
      case "bulletList":
      case "orderedList":
        return children.join("\n");
      case "listItem":
        return `• ${children.join("")}`;
      case "taskList":
        return children.join("\n");
      case "taskItem": {
        const checked = node.attrs?.checked ? "[x]" : "[ ]";
        return `${checked} ${children.join("")}`;
      }
      case "blockquote":
        return children.map((c) => `> ${c}`).join("\n");
      case "codeBlock": {
        const lang = (node.attrs?.language as string) ?? "";
        return `\`\`\`${lang}\n${children.join("")}\n\`\`\``;
      }
      case "image":
        return `[image: ${node.attrs?.src ?? ""}]`;
      case "roadmapBlock": {
        try {
          const items = JSON.parse(
            (node.attrs?.items as string) ?? "[]",
          ) as Array<{
            name?: string;
            startAt?: string;
            endAt?: string;
            statusId?: string;
          }>;
          if (items.length === 0) return "[roadmap block vazio]";
          const summary = items
            .map(
              (item) =>
                `${item.name ?? "?"} (${item.startAt ?? "?"} → ${item.endAt ?? "?"}, ${item.statusId ?? "?"})`,
            )
            .join(", ");
          return `[roadmap: ${summary}]`;
        } catch {
          return "[roadmap block]";
        }
      }
      default:
        return children.join("");
    }
  };

  lines.push(walk(doc));
  return lines.join("").trim();
}
