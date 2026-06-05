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

const replaceContentField = z
  .string()
  .describe(
    'Conteúdo Markdown a aplicar. Use string vazia ("") para APAGAR/remover o conteúdo alvo.',
  );

const titleField = z
  .string()
  .min(1)
  .max(80)
  .describe(
    "Título curto (3 a 6 palavras), claro e descritivo da mudança para o usuário, em português. Ex.: 'Adicionar seção de Introdução'. NUNCA use o nome técnico da ferramenta.",
  );

const appendToEndSchema = z.object({
  title: titleField,
  content: markdownContentField,
});

const insertAfterBlockSchema = z.object({
  title: titleField,
  blockIndex: blockIndexField,
  content: markdownContentField,
});

const insertBeforeBlockSchema = z.object({
  title: titleField,
  blockIndex: blockIndexField,
  content: markdownContentField,
});

const replaceBlockSchema = z.object({
  title: titleField,
  blockIndex: blockIndexField,
  content: replaceContentField,
});

const replaceSelectionSchema = z.object({
  title: titleField,
  content: replaceContentField,
});

const replaceEntireNoteSchema = z.object({
  title: titleField,
  content: replaceContentField,
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
