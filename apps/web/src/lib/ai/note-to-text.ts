interface TiptapNode {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
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
          ) as Array<{ name?: string; startAt?: string; endAt?: string; statusId?: string }>;
          if (items.length === 0) return "[roadmap block vazio]";
          const summary = items
            .map((item) => `${item.name ?? "?"} (${item.startAt ?? "?"} → ${item.endAt ?? "?"}, ${item.statusId ?? "?"})`)
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
