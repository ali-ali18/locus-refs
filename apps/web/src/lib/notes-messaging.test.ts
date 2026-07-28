import { describe, expect, it } from "vitest";
import { noteJsonToMessageText } from "./notes-messaging";

describe("noteJsonToMessageText", () => {
  it("returns empty string for empty doc", () => {
    expect(noteJsonToMessageText({ type: "doc", content: [] })).toBe("");
  });

  it("formats bold and italic marks", () => {
    expect(
      noteJsonToMessageText({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Olá ", marks: [{ type: "bold" }] },
              { type: "text", text: "mundo", marks: [{ type: "italic" }] },
            ],
          },
        ],
      }),
    ).toBe("*Olá* _mundo_");
  });

  it("formats mixed bold+italic and strike", () => {
    expect(
      noteJsonToMessageText({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "urgente",
                marks: [{ type: "bold" }, { type: "italic" }],
              },
              { type: "text", text: " " },
              {
                type: "text",
                text: "cancelado",
                marks: [{ type: "strike" }],
              },
            ],
          },
        ],
      }),
    ).toBe("_*urgente*_ ~cancelado~");
  });

  it("formats quotation-style bullet list", () => {
    expect(
      noteJsonToMessageText({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Cotação:" }],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Frete: R$ 120" }],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Prazo: 3 dias" }],
                  },
                ],
              },
            ],
          },
        ],
      }),
    ).toBe("Cotação:\n\n- Frete: R$ 120\n- Prazo: 3 dias");
  });

  it("formats ordered lists and headings", () => {
    expect(
      noteJsonToMessageText({
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Aviso" }],
          },
          {
            type: "orderedList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Separar pedido" }],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Enviar NF" }],
                  },
                ],
              },
            ],
          },
        ],
      }),
    ).toBe("*Aviso*\n\n1. Separar pedido\n2. Enviar NF");
  });

  it("formats links for tracking", () => {
    expect(
      noteJsonToMessageText({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Rastreio: " },
              {
                type: "text",
                text: "abrir",
                marks: [
                  {
                    type: "link",
                    attrs: { href: "https://rastreio.example/123" },
                  },
                ],
              },
            ],
          },
        ],
      }),
    ).toBe("Rastreio: abrir (https://rastreio.example/123)");
  });

  it("formats inline code and code blocks", () => {
    expect(
      noteJsonToMessageText({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Código ", marks: [{ type: "code" }] },
              { type: "text", text: "ABC" },
            ],
          },
          {
            type: "codeBlockCustom",
            content: [{ type: "text", text: "SELECT 1" }],
          },
        ],
      }),
    ).toBe("```Código``` ABC\n\n```\nSELECT 1\n```");
  });

  it("discards emoji nodes and unicode emoji", () => {
    expect(
      noteJsonToMessageText({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Olá " },
              { type: "emoji", attrs: { name: "🔥" } },
              { type: "text", text: " equipe 🚀" },
            ],
          },
        ],
      }),
    ).toBe("Olá  equipe");
  });
});
