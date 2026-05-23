import { convertToModelMessages, smoothStream, streamText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/ai/models";
import { noteJsonToText } from "@/lib/ai/note-to-text";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

const DEFAULT_SYSTEM_PROMPT =
  "Você é um assistente de notas inteligente. Ajude o usuário a escrever, organizar e melhorar suas notas. Seja conciso e direto. Responda sempre no mesmo idioma da pergunta do usuário.";

export async function POST(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  try {
    const { noteId, messages, modelId } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages é obrigatório", code: "MISSING_MESSAGES" },
        { status: 400 },
      );
    }

    const aiSettings = await prisma.workspaceAiSettings.findUnique({
      where: { workspaceId },
    });

    const resolvedModelId = modelId ?? aiSettings?.defaultModelId;
    const model = getModel(resolvedModelId);

    let noteContext = "";
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
    }

    const systemPrompt =
      (aiSettings?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT) + noteContext;

    const result = streamText({
      model: model.build(),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      experimental_transform: smoothStream({ chunking: "word", delayInMs: 15 }),
    });

    return result.toUIMessageStreamResponse();
  } catch (_error) {
    return NextResponse.json(
      { error: "Falha ao processar requisição de IA" },
      { status: 500 },
    );
  }
}
