import { convertToModelMessages, smoothStream, streamText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/ai/models";
import { noteJsonToText } from "@/lib/ai/note-to-text";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

const DEFAULT_SYSTEM_PROMPT =
  "Voce e um assistente de notas inteligente. Ajude o usuario a escrever, organizar e melhorar suas notas. Seja conciso e direto. Responda sempre no mesmo idioma da pergunta do usuario. Use Markdown para estruturar listas, titulos e codigo quando isso ajudar.";

const NOTE_EDITING_PROMPT =
  "Quando houver uma nota atual no contexto e o pedido implicar escrever, revisar, resumir, reestruturar, cortar, limpar, remover ou substituir conteudo, responda com a versao final proposta em Markdown, pronta para aplicacao. Nao adicione introducoes, explicacoes, despedidas nem perguntas do tipo 'quer que eu ajuste algo?'. So faca perguntas se faltar informacao critica para executar o pedido. Se o usuario pedir para remover, encurtar ou substituir partes do texto, reflita isso diretamente na proposta final.";

const ROADMAP_BLOCK_PROMPT =
  'Se o usuario pedir explicitamente um roadmap block, responda usando um fenced block com linguagem `roadmap` contendo JSON valido no formato {"items":[{"name":"...","startAt":"YYYY-MM-DD","endAt":"YYYY-MM-DD","statusId":"todo|in-progress|done"}],"statuses":[{"id":"todo","name":"A fazer","color":"#94a3b8"}]}.';

interface SelectionContext {
  hasSelection?: boolean;
  text?: string;
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
    let selectionPrompt = "";
    if (noteId) {
      const note = await prisma.note.findUnique({
        where: { id: noteId, workspaceId },
        select: { title: true, content: true },
      });
      if (note) {
        const contentText = note.content
          ? noteJsonToText(note.content as Parameters<typeof noteJsonToText>[0])
          : "";
        noteContext = `\n\n## Nota atual: "${note.title}"\n\n${contentText}`;
      }

      const selection = selectionContext as SelectionContext | undefined;
      if (selection?.hasSelection && selection.text?.trim()) {
        selectionPrompt =
          `\n\n## Trecho selecionado\n\n${selection.text.trim()}` +
          "\n\nSe o pedido for de edicao, responda apenas com a nova versao desse trecho, em Markdown, sem repetir o resto da nota.";
      } else {
        selectionPrompt =
          "\n\nSe o pedido for de edicao da nota, responda com a nova versao completa da nota em Markdown.";
      }
    }

    const systemPrompt =
      (aiSettings?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT) +
      (noteId ? `\n\n${NOTE_EDITING_PROMPT}` : "") +
      (noteId ? `\n\n${ROADMAP_BLOCK_PROMPT}` : "") +
      selectionPrompt +
      noteContext;

    const result = streamText({
      model: model.build(),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      experimental_transform: smoothStream({ chunking: "word", delayInMs: 15 }),
    });

    return result.toUIMessageStreamResponse();
  } catch (_error) {
    return NextResponse.json(
      { error: "Falha ao processar requisicao de IA" },
      { status: 500 },
    );
  }
}
