import type { Prisma } from "@/generated/prisma/client";

export interface TiptapNode {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: unknown[];
}

function blockPlainText(node: TiptapNode): string {
  if (node.type === "text") return node.text ?? "";
  return (node.content ?? []).map(blockPlainText).join("");
}

export function listDocBlocks(doc: TiptapNode): Array<{
  index: number;
  type: string;
  text: string;
}> {
  const blocks = doc.content ?? [];
  return blocks.map((block, index) => ({
    index,
    type: block.type ?? "unknown",
    text: blockPlainText(block).trim(),
  }));
}

export function removeBlockAt(
  doc: TiptapNode,
  blockIndex: number,
): { doc: TiptapNode; removed: TiptapNode | null } {
  const blocks = [...(doc.content ?? [])];
  if (blockIndex < 0 || blockIndex >= blocks.length) {
    return { doc, removed: null };
  }
  const [removed] = blocks.splice(blockIndex, 1);
  return {
    doc: { ...doc, type: doc.type ?? "doc", content: blocks },
    removed: removed ?? null,
  };
}

/** Remove top-level blocks whose plain text equals or contains `target` (case-insensitive). */
export function removeBlocksMatchingText(
  doc: TiptapNode,
  target: string,
): { doc: TiptapNode; removedCount: number; removedTexts: string[] } {
  const needle = target.trim().toLowerCase();
  if (!needle) {
    return { doc, removedCount: 0, removedTexts: [] };
  }

  const removedTexts: string[] = [];
  const kept = (doc.content ?? []).filter((block) => {
    const text = blockPlainText(block).trim();
    const lower = text.toLowerCase();
    const matches = lower === needle || lower.includes(needle);
    if (matches) removedTexts.push(text);
    return !matches;
  });

  return {
    doc: { ...doc, type: doc.type ?? "doc", content: kept },
    removedCount: removedTexts.length,
    removedTexts,
  };
}

/** Replace a top-level block with a simple paragraph of plain text (empty = delete). */
export function replaceBlockWithPlainText(
  doc: TiptapNode,
  blockIndex: number,
  text: string,
): { doc: TiptapNode; ok: boolean } {
  const blocks = [...(doc.content ?? [])];
  if (blockIndex < 0 || blockIndex >= blocks.length) {
    return { doc, ok: false };
  }

  const trimmed = text.trim();
  if (!trimmed) {
    blocks.splice(blockIndex, 1);
  } else {
    blocks[blockIndex] = {
      type: "paragraph",
      content: [{ type: "text", text: trimmed }],
    };
  }

  return {
    doc: { ...doc, type: doc.type ?? "doc", content: blocks },
    ok: true,
  };
}

export function toPrismaJson(doc: TiptapNode): Prisma.InputJsonValue {
  return doc as unknown as Prisma.InputJsonValue;
}
