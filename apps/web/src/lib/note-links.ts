interface TiptapNode {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
}

export function extractNoteLinkIds(doc: TiptapNode): string[] {
  const ids = new Set<string>();

  const walk = (node: TiptapNode) => {
    if (node.type === "noteLink" && typeof node.attrs?.id === "string") {
      ids.add(node.attrs.id);
    }
    node.content?.forEach(walk);
  };

  walk(doc);
  return [...ids];
}
