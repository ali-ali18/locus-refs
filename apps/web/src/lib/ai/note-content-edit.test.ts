import { describe, expect, it } from "vitest";
import {
  listDocBlocks,
  removeBlocksMatchingText,
  removeBlockAt,
  replaceBlockWithPlainText,
  type TiptapNode,
} from "./note-content-edit";

const sampleDoc: TiptapNode = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Introdução" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "sadass" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Conclusão" }],
    },
  ],
};

describe("note-content-edit", () => {
  it("lists blocks with plain text", () => {
    expect(listDocBlocks(sampleDoc)).toEqual([
      { index: 0, type: "paragraph", text: "Introdução" },
      { index: 1, type: "paragraph", text: "sadass" },
      { index: 2, type: "paragraph", text: "Conclusão" },
    ]);
  });

  it("removes blocks matching text", () => {
    const result = removeBlocksMatchingText(sampleDoc, "sadass");
    expect(result.removedCount).toBe(1);
    expect(result.removedTexts).toEqual(["sadass"]);
    expect(listDocBlocks(result.doc).map((b) => b.text)).toEqual([
      "Introdução",
      "Conclusão",
    ]);
  });

  it("removes block by index", () => {
    const result = removeBlockAt(sampleDoc, 1);
    expect(result.removed).toBeTruthy();
    expect(listDocBlocks(result.doc).map((b) => b.text)).toEqual([
      "Introdução",
      "Conclusão",
    ]);
  });

  it("replaces block with plain text or deletes when empty", () => {
    const replaced = replaceBlockWithPlainText(sampleDoc, 1, "ok");
    expect(replaced.ok).toBe(true);
    expect(listDocBlocks(replaced.doc)[1]?.text).toBe("ok");

    const deleted = replaceBlockWithPlainText(sampleDoc, 1, "");
    expect(deleted.ok).toBe(true);
    expect(listDocBlocks(deleted.doc)).toHaveLength(2);
  });
});
