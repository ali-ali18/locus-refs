import { tool } from "ai";
import { z } from "zod";

const blockIndexField = z
  .number()
  .int()
  .min(0)
  .describe(
    "Índice (0-based) do bloco top-level alvo, conforme enumeração da nota.",
  );

const markdownContentField = z
  .string()
  .min(1)
  .describe("Conteúdo Markdown a aplicar no editor.");

const appendToEndSchema = z.object({
  content: markdownContentField,
});

const insertAfterBlockSchema = z.object({
  blockIndex: blockIndexField,
  content: markdownContentField,
});

const insertBeforeBlockSchema = z.object({
  blockIndex: blockIndexField,
  content: markdownContentField,
});

const replaceBlockSchema = z.object({
  blockIndex: blockIndexField,
  content: markdownContentField,
});

const replaceSelectionSchema = z.object({
  content: markdownContentField,
});

const replaceEntireNoteSchema = z.object({
  content: markdownContentField,
});

export const noteEditTools = {
  appendToEnd: tool({
    description: "Anexa conteúdo Markdown no fim da nota.",
    inputSchema: appendToEndSchema,
  }),
  insertAfterBlock: tool({
    description:
      "Insere conteúdo Markdown logo depois do bloco indicado por blockIndex.",
    inputSchema: insertAfterBlockSchema,
  }),
  insertBeforeBlock: tool({
    description:
      "Insere conteúdo Markdown logo antes do bloco indicado por blockIndex.",
    inputSchema: insertBeforeBlockSchema,
  }),
  replaceBlock: tool({
    description:
      "Substitui o bloco indicado por blockIndex pelo novo Markdown.",
    inputSchema: replaceBlockSchema,
  }),
  replaceSelection: tool({
    description:
      "Substitui o trecho atualmente selecionado pelo novo Markdown. Use APENAS quando houver seleção ativa.",
    inputSchema: replaceSelectionSchema,
  }),
  replaceEntireNote: tool({
    description:
      "Substitui TODO o conteúdo da nota pelo novo Markdown. Use quando o usuário pedir para reescrever, reorganizar ou refazer a nota inteira.",
    inputSchema: replaceEntireNoteSchema,
  }),
} as const;

export type NoteEditToolName = keyof typeof noteEditTools;

export type NoteEditToolInput =
  | { name: "appendToEnd"; input: z.infer<typeof appendToEndSchema> }
  | { name: "insertAfterBlock"; input: z.infer<typeof insertAfterBlockSchema> }
  | {
      name: "insertBeforeBlock";
      input: z.infer<typeof insertBeforeBlockSchema>;
    }
  | { name: "replaceBlock"; input: z.infer<typeof replaceBlockSchema> }
  | { name: "replaceSelection"; input: z.infer<typeof replaceSelectionSchema> }
  | {
      name: "replaceEntireNote";
      input: z.infer<typeof replaceEntireNoteSchema>;
    };

export interface NoteEditToolResult {
  status: "applied" | "denied" | "error";
  reason?: string;
}
