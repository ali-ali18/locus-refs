import { describe, expect, it } from "vitest";
import { extractNoteLinkIds } from "./note-links";

describe("extractNoteLinkIds", () => {
  it("collects unique note link ids", () => {
    expect(
      extractNoteLinkIds({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Ver " },
              {
                type: "noteLink",
                attrs: { id: "note-1", title: "Frete" },
              },
              { type: "text", text: " e " },
              {
                type: "noteLink",
                attrs: { id: "note-2", title: "Aviso" },
              },
              {
                type: "noteLink",
                attrs: { id: "note-1", title: "Frete" },
              },
            ],
          },
        ],
      }),
    ).toEqual(["note-1", "note-2"]);
  });

  it("returns empty array when there are no links", () => {
    expect(
      extractNoteLinkIds({
        type: "doc",
        content: [{ type: "paragraph", content: [{ type: "text", text: "Oi" }] }],
      }),
    ).toEqual([]);
  });
});
