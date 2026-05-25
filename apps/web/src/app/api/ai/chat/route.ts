import { convertToModelMessages, smoothStream, streamText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { classifyIntent } from "@/lib/ai/classify-intent";
import type { AiIntent, AiMessageMetadata } from "@/lib/ai/intent";
import { getModel } from "@/lib/ai/models";
import {
  noteJsonToEnumeratedText,
  noteJsonToText,
} from "@/lib/ai/note-to-text";
import { noteEditTools } from "@/lib/ai/tools";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

const DEFAULT_SYSTEM_PROMPT =
  "Voce e um assistente de notas inteligente. Ajude o usuario a escrever, organizar e melhorar suas notas. Seja conciso e direto. Responda sempre no mesmo idioma da pergunta do usuario. Use Markdown para estruturar listas, titulos e codigo quando isso ajudar.";

const ROADMAP_BLOCK_PROMPT =
  'Se o usuario pedir explicitamente um roadmap block, responda usando um fenced block com linguagem `roadmap` contendo JSON valido no formato {"items":[{"name":"...","startAt":"YYYY-MM-DD","endAt":"YYYY-MM-DD","statusId":"todo|in-progress|done"}],"statuses":[{"id":"todo","name":"A fazer","color":"#94a3b8"}]}.';

const CHAT_INTENT_PROMPT =
  "Voce pode referenciar a nota atual para responder perguntas, mas NAO produza conteudo para inserir na nota a nao ser que o usuario peca explicitamente. Converse normalmente.";

const PLAN_INTENT_PROMPT =
  "Responda com um plano estruturado: 1-2 linhas de introducao seguidas de uma lista numerada de passos acionaveis. Use Markdown.";

const SUGGESTION_TOOL_PROMPT = `Voce deve aplicar mudancas na nota usando EXCLUSIVAMENTE as ferramentas disponiveis:
- replaceSelection: quando ha um trecho selecionado pelo usuario.
- insertAfterBlock / insertBeforeBlock: para inserir conteudo em uma posicao especifica relativa a um bloco existente (use o indice [N] mostrado na enumeracao da nota).
- replaceBlock: para reescrever inteiramente um bloco existente (use o indice [N]).
- replaceEntireNote: quando o usuario pedir para reescrever, reorganizar ou refazer a nota INTEIRA. Prefira esta tool a emitir multiplos replaceBlock em sequencia.
- appendToEnd: somente quando o usuario pedir explicitamente para anexar no fim ou quando nao houver posicao melhor.

Regras:
1. Para uma unica mudanca pontual, emita UMA tool call.
2. Para multiplas mudancas, emita varias tool calls na mesma resposta.
3. Cada tool call deve conter Markdown PRONTO para inserir, sem introducao, despedida ou comentarios.
4. Voce PODE escrever uma frase curta de texto antes das tool calls explicando o plano, mas o conteudo da nota vai SEMPRE via tools.
5. NUNCA invente um blockIndex que nao apareca na enumeracao.`;

interface SelectionContext {
  hasSelection?: boolean;
  text?: string;
}

interface BuildPromptParams {
  intent: AiIntent;
  baseSystem: string;
  noteContext: string;
  enumeratedBlocks: string;
  selectionText: string | null;
}

function buildSystemPrompt({
  intent,
  baseSystem,
  noteContext,
  enumeratedBlocks,
  selectionText,
}: BuildPromptParams): string {
  const parts: string[] = [baseSystem, ROADMAP_BLOCK_PROMPT];

  if (intent === "chat") {
    if (noteContext) {
      parts.push(CHAT_INTENT_PROMPT);
      parts.push(noteContext);
    }
    return parts.join("\n\n");
  }

  if (intent === "plan") {
    parts.push(PLAN_INTENT_PROMPT);
    if (noteContext) parts.push(noteContext);
    return parts.join("\n\n");
  }

  // suggestion
  parts.push(SUGGESTION_TOOL_PROMPT);
  if (enumeratedBlocks) {
    parts.push(`## Nota atual (blocos enumerados)\n\n${enumeratedBlocks}`);
  }
  if (selectionText) {
    parts.push(
      `## Trecho selecionado pelo usuario\n\n${selectionText}\n\nUse a ferramenta replaceSelection para substituir este trecho.`,
    );
  }
  return parts.join("\n\n");
}

export async function POST(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  try {
    const { noteId, messages, modelId, selectionContext } =
      await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages e obrigatorio", code: "MISSING_MESSAGES" },
        { status: 400 },
      );
    }

    const aiSettings = await prisma.workspaceAiSettings.findUnique({
      where: { workspaceId },
    });

    const resolvedModelId = modelId ?? aiSettings?.defaultModelId;
    const model = getModel(resolvedModelId);

    let noteContext = "";
    let enumeratedBlocks = "";
    let selectionText: string | null = null;
    if (noteId) {
      const note = await prisma.note.findUnique({
        where: { id: noteId, workspaceId },
        select: { title: true, content: true },
      });
      if (note) {
        const contentJson = note.content as
          | Parameters<typeof noteJsonToText>[0]
          | null;
        const contentText = contentJson ? noteJsonToText(contentJson) : "";
        noteContext = `## Nota atual: "${note.title}"\n\n${contentText}`;
        enumeratedBlocks = contentJson
          ? noteJsonToEnumeratedText(contentJson)
          : "";
      }

      const selection = selectionContext as SelectionContext | undefined;
      if (selection?.hasSelection && selection.text?.trim()) {
        selectionText = selection.text.trim();
      }
    }

    const lastUserMessage = [...messages]
      .reverse()
      .find((m: { role?: string }) => m?.role === "user") as
      | { parts?: Array<{ type?: string; text?: string }> }
      | undefined;
    const lastUserText =
      lastUserMessage?.parts
        ?.filter((p) => p?.type === "text" && typeof p.text === "string")
        .map((p) => p.text as string)
        .join("\n")
        .trim() ?? "";

    const intent: AiIntent = await classifyIntent({
      userMessage: lastUserText,
      hasSelection: !!selectionText,
      hasNoteContext: !!noteContext,
    });

    const systemPrompt = buildSystemPrompt({
      intent,
      baseSystem: aiSettings?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
      noteContext,
      enumeratedBlocks,
      selectionText,
    });

    const filteredMessages =
      intent !== "suggestion"
        ? messages.filter((m) => m.role !== "tool")
        : messages;

    const result = streamText({
      model: model.build(),
      system: systemPrompt,
      messages: await convertToModelMessages(filteredMessages),
      tools: intent === "suggestion" ? noteEditTools : undefined,
      experimental_transform: smoothStream({ chunking: "word", delayInMs: 15 }),
    });

    return result.toUIMessageStreamResponse({
      messageMetadata: ({ part }): AiMessageMetadata | undefined => {
        if (part.type === "start") return { intent };
        return undefined;
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Falha ao processar requisicao de IA" },
      { status: 500 },
    );
  }
}
