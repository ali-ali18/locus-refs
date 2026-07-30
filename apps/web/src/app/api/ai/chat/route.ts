import {
  convertToModelMessages,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";
import { type NextRequest, NextResponse } from "next/server";
import type { AiMessageMetadata } from "@/lib/ai/intent";
import { getModel } from "@/lib/ai/models";
import {
  noteJsonToEnumeratedText,
  noteJsonToText,
} from "@/lib/ai/note-to-text";
import {
  AGENT_WORKSPACE_BOUND_PROMPT,
  DEFAULT_SYSTEM_PROMPT,
  NOTE_EDIT_TOOL_PROMPT,
  ROADMAP_BLOCK_PROMPT,
} from "@/lib/ai/prompts";
import { getAgentSkill } from "@/lib/ai/skills";
import { noteEditTools } from "@/lib/ai/tools";
import { createWorkspaceTools } from "@/lib/ai/workspace-tools";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

interface SelectionContext {
  hasSelection?: boolean;
  text?: string;
}

interface MentionPayload {
  type: "note" | "noteCollection" | "resourceCollection" | "board";
  id: string;
  title?: string;
}

async function resolveMentions(
  workspaceId: string,
  mentions: MentionPayload[] | undefined,
): Promise<string> {
  if (!mentions?.length) return "";

  const blocks: string[] = [];

  for (const mention of mentions.slice(0, 8)) {
    if (mention.type === "note") {
      const note = await prisma.note.findUnique({
        where: { id: mention.id, workspaceId },
        select: { id: true, title: true, content: true },
      });
      if (!note) continue;
      const text = note.content
        ? noteJsonToText(note.content as Parameters<typeof noteJsonToText>[0])
        : "";
      blocks.push(
        `### Nota mencionada: "${note.title}" (${note.id})\n\n${text.slice(0, 4000)}`,
      );
      continue;
    }

    if (mention.type === "noteCollection") {
      const collection = await prisma.collection.findFirst({
        where: {
          id: mention.id,
          workspaceId,
          isNoteCollection: true,
        },
        select: {
          id: true,
          name: true,
          notes: {
            orderBy: { updatedAt: "desc" },
            take: 20,
            select: { id: true, title: true },
          },
        },
      });
      if (!collection) continue;
      const noteLines =
        collection.notes.length === 0
          ? "- (nenhuma nota nesta pasta)"
          : collection.notes
              .map((n) => `- ${n.title || "Sem título"} (${n.id})`)
              .join("\n");
      blocks.push(
        `### Pasta de NOTAS mencionada: "${collection.name}" (id: ${collection.id}, tipo: noteCollection)\nNotas nesta pasta:\n${noteLines}`,
      );
      continue;
    }

    if (mention.type === "resourceCollection") {
      const collection = await prisma.collection.findFirst({
        where: {
          id: mention.id,
          workspaceId,
          isNoteCollection: false,
        },
        select: {
          id: true,
          name: true,
          resources: {
            orderBy: { updatedAt: "desc" },
            take: 30,
            select: { id: true, title: true, url: true, description: true },
          },
        },
      });
      if (!collection) continue;
      const resourceLines =
        collection.resources.length === 0
          ? "- (nenhum recurso nesta coleção)"
          : collection.resources
              .map(
                (r) =>
                  `- ${r.title} | ${r.url}${r.description ? ` — ${r.description.slice(0, 120)}` : ""} (${r.id})`,
              )
              .join("\n");
      blocks.push(
        `### Coleção de RECURSOS mencionada: "${collection.name}" (id: ${collection.id}, tipo: resourceCollection)\nIsto NÃO é pasta de notas. Recursos (links) nesta coleção:\n${resourceLines}`,
      );
      continue;
    }

    if (mention.type === "board") {
      const board = await prisma.board.findFirst({
        where: { id: mention.id, workspaceId, deletedAt: null },
        select: { id: true, title: true, description: true },
      });
      if (!board) continue;
      blocks.push(
        `### Board mencionado: "${board.title}" (${board.id})\n${board.description ?? ""}`,
      );
    }
  }

  if (!blocks.length) return "";
  return `## Conteudo mencionado (@)\n\n${blocks.join("\n\n")}`;
}

function buildAgentSystemPrompt(params: {
  baseSystem: string;
  workspaceName: string;
  noteContext: string;
  enumeratedBlocks: string;
  selectionText: string | null;
  mentionsContext: string;
  skillLabel: string | null;
  hasOpenNote: boolean;
}): string {
  const parts: string[] = [
    params.baseSystem,
    AGENT_WORKSPACE_BOUND_PROMPT,
    ROADMAP_BLOCK_PROMPT,
    `## Workspace ativo\nNome: ${params.workspaceName}\nVoce so pode operar neste workspace.`,
  ];

  if (params.skillLabel) {
    parts.push(
      `## Skill ativa\nO usuario disparou a skill "${params.skillLabel}". Siga esse objetivo.`,
    );
  }

  if (params.hasOpenNote) {
    parts.push(NOTE_EDIT_TOOL_PROMPT);
    if (params.enumeratedBlocks) {
      parts.push(
        `## Nota atual (blocos enumerados)\n\n${params.enumeratedBlocks}`,
      );
    } else if (params.noteContext) {
      parts.push(params.noteContext);
    }
    if (params.selectionText) {
      parts.push(
        `## Trecho selecionado pelo usuario\n\n${params.selectionText}\n\nUse a ferramenta replaceSelection para substituir este trecho.`,
      );
    }
  } else if (params.noteContext) {
    parts.push(params.noteContext);
  }

  if (params.mentionsContext) {
    parts.push(params.mentionsContext);
  }

  return parts.join("\n\n");
}

export async function POST(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId, session } = auth;

  try {
    const { noteId, messages, modelId, selectionContext, skillId, mentions } =
      await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages e obrigatorio", code: "MISSING_MESSAGES" },
        { status: 400 },
      );
    }

    const [aiSettings, workspace] = await Promise.all([
      prisma.workspaceAiSettings.findUnique({ where: { workspaceId } }),
      prisma.organization.findUnique({
        where: { id: workspaceId },
        select: { name: true },
      }),
    ]);

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace nao encontrado", code: "WORKSPACE_NOT_FOUND" },
        { status: 404 },
      );
    }

    const resolvedModelId = modelId ?? aiSettings?.defaultModelId;
    const model = getModel(resolvedModelId);
    const skill = getAgentSkill(skillId);

    let noteContext = "";
    let enumeratedBlocks = "";
    let selectionText: string | null = null;
    let hasOpenNote = false;
    if (noteId) {
      const note = await prisma.note.findUnique({
        where: { id: noteId, workspaceId },
        select: { title: true, content: true },
      });
      if (note) {
        hasOpenNote = true;
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

    const mentionsContext = await resolveMentions(
      workspaceId,
      mentions as MentionPayload[] | undefined,
    );

    const systemPrompt = buildAgentSystemPrompt({
      baseSystem: aiSettings?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
      workspaceName: workspace.name,
      noteContext,
      enumeratedBlocks,
      selectionText,
      mentionsContext,
      skillLabel: skill?.label ?? null,
      hasOpenNote,
    });

    const workspaceTools = createWorkspaceTools({
      workspaceId,
      userId: session.user.id,
      currentNoteId: typeof noteId === "string" ? noteId : null,
    });

    const tools = {
      ...workspaceTools,
      ...(hasOpenNote ? noteEditTools : {}),
    };

    const result = streamText({
      model: model.build(),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(6),
      experimental_transform: smoothStream({ chunking: "word", delayInMs: 15 }),
    });

    return result.toUIMessageStreamResponse({
      messageMetadata: ({ part }): AiMessageMetadata | undefined => {
        if (part.type === "start") {
          return { intent: noteId ? "suggestion" : "chat" };
        }
        return undefined;
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Falha ao processar requisicao de IA", details: message },
      { status: 500 },
    );
  }
}
