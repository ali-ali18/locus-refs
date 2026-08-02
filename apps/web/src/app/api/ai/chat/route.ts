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
import { pdfBufferToText } from "@/lib/ai/pdf-to-text";
import { buildThinkingProviderOptions } from "@/lib/ai/thinking";
import {
  AGENT_WORKSPACE_BOUND_PROMPT,
  DEFAULT_SYSTEM_PROMPT,
  NOTE_EDIT_TOOL_PROMPT,
  ROADMAP_BLOCK_PROMPT,
} from "@/lib/ai/prompts";
import { resolveAgentSkill } from "@/lib/ai/skills/resolve-skill";
import { noteEditTools } from "@/lib/ai/tools";
import { createWorkspaceTools } from "@/lib/ai/workspace-tools";
import prisma from "@/lib/prisma";
import { getStorageObjectBuffer } from "@/server/chat-uploads";
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
  attachmentsContext: string;
  skillLabel: string | null;
  skillPrompt: string | null;
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
      [
        `## Skill ativa: "${params.skillLabel}"`,
        "Siga o objetivo desta skill. Se o usuario escreveu texto adicional, trate-o como contexto/complemento.",
        params.skillPrompt ? `\n### Instrucoes da skill\n${params.skillPrompt}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
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

  if (params.attachmentsContext) {
    parts.push(params.attachmentsContext);
  }

  return parts.join("\n\n");
}

type UiFilePart = {
  type: "file";
  url?: string;
  mediaType?: string;
  filename?: string;
};

function toStoragePublicPath(url: string): string | null {
  if (!url) return null;
  if (url.startsWith("/storage/")) return url;
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/storage/")) return parsed.pathname;
  } catch {
    // ignore
  }
  const idx = url.indexOf("/storage/");
  if (idx >= 0) return url.slice(idx);
  return null;
}

function collectLastUserFileParts(messages: unknown[]): UiFilePart[] {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i] as {
      role?: string;
      parts?: unknown[];
      content?: unknown;
    };
    if (msg?.role !== "user") continue;

    const fromParts = Array.isArray(msg.parts)
      ? msg.parts.filter(
          (part): part is UiFilePart =>
            !!part &&
            typeof part === "object" &&
            (part as { type?: string }).type === "file",
        )
      : [];

    if (fromParts.length) return fromParts;
  }
  return [];
}

type AttachmentExtractResult = {
  /** Bloco curto para o system prompt (regras). */
  systemHint: string;
  /** Texto do documento para anexar na mensagem do usuario. */
  userDocumentText: string;
};

async function extractAttachments(
  workspaceId: string,
  files: UiFilePart[],
): Promise<AttachmentExtractResult> {
  const documents: string[] = [];
  const failures: string[] = [];

  for (const file of files.slice(0, 5)) {
    const publicPath = toStoragePublicPath(file.url ?? "");
    if (!publicPath) {
      failures.push(
        `${file.filename ?? "arquivo"} (url invalida: nao e /storage/...)`,
      );
      continue;
    }
    const key = publicPath.slice("/storage/".length);
    if (!key.startsWith(`${workspaceId}/chat/`)) {
      failures.push(`${file.filename ?? "arquivo"} (fora da pasta chat)`);
      continue;
    }

    const mediaType = file.mediaType ?? "";
    const name = file.filename ?? "arquivo";
    const lowerName = name.toLowerCase();
    const isPdf = mediaType.includes("pdf") || lowerName.endsWith(".pdf");
    const isText =
      mediaType.startsWith("text/plain") ||
      mediaType.startsWith("text/") ||
      lowerName.endsWith(".txt");

    if (!isPdf && !isText) continue;

    const buffer = await getStorageObjectBuffer(publicPath);
    if (!buffer) {
      failures.push(`${name} (falha ao baixar do storage)`);
      continue;
    }

    try {
      let text = "";
      if (isPdf) {
        text = await pdfBufferToText(buffer);
        if (!text) {
          failures.push(
            `${name} (PDF sem texto extraivel — pode ser scan/imagem)`,
          );
          continue;
        }
      } else {
        text = buffer.toString("utf8").replace(/\u0000/g, "").trim();
        if (text.length > 40_000) {
          text = `${text.slice(0, 40_000)}\n\n[…texto truncado]`;
        }
        if (!text) {
          failures.push(`${name} (arquivo vazio)`);
          continue;
        }
      }

      documents.push(
        `### Documento: ${name}\n<<<INICIO_DOCUMENTO>>>\n${text}\n<<<FIM_DOCUMENTO>>>`,
      );
    } catch (error) {
      const details = error instanceof Error ? error.message : "erro desconhecido";
      failures.push(`${name} (erro na extracao: ${details})`);
    }
  }

  if (!documents.length && !failures.length) {
    return { systemHint: "", userDocumentText: "" };
  }

  if (!documents.length) {
    return {
      systemHint: `## Arquivos anexados
Nao foi possivel ler o(s) arquivo(s): ${failures.join("; ")}.
Voce DEVE informar isso ao usuario e pedir para colar o texto ou enviar PDF com texto selecionavel.
NUNCA invente dados (curriculo, pedido, CNPJ, CEP, etc.).`,
      userDocumentText: "",
    };
  }

  const failureNote = failures.length
    ? `\nAlguns arquivos falharam: ${failures.join("; ")}.`
    : "";

  return {
    systemHint: `## Arquivos anexados
O conteudo completo dos documentos foi incluido na mensagem do usuario.
Regras:
- Use APENAS o texto entre <<<INICIO_DOCUMENTO>>> e <<<FIM_DOCUMENTO>>>.
- NUNCA invente nomes, datas, empresas, telefones ou outros dados que nao estejam no documento.
- Se algo nao estiver no texto, diga que nao consta no arquivo.${failureNote}`,
    userDocumentText: `## Conteudo extraido do(s) arquivo(s) anexado(s)\n\n${documents.join("\n\n")}`,
  };
}

export async function POST(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId, session } = auth;

  try {
    const { noteId, messages, modelId, selectionContext, skillId, mentions, attachments } =
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
    const skill = await resolveAgentSkill({
      skillId: typeof skillId === "string" ? skillId : undefined,
      userId: session.user.id,
      workspaceId,
    });

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

    const filePartsFromMessages = collectLastUserFileParts(messages);
    const filePartsFromBody = Array.isArray(attachments)
      ? (attachments as Array<{
          url?: string;
          mediaType?: string;
          filename?: string;
        }>)
          .filter((a) => typeof a?.url === "string")
          .map(
            (a): UiFilePart => ({
              type: "file",
              url: a.url,
              mediaType: a.mediaType,
              filename: a.filename,
            }),
          )
      : [];
    const fileParts =
      filePartsFromMessages.length > 0
        ? filePartsFromMessages
        : filePartsFromBody;
    const supportsVision =
      model.metadata?.inputModalities?.includes("image") ?? false;
    const hasImages = fileParts.some((f) =>
      (f.mediaType ?? "").startsWith("image/"),
    );
    if (hasImages && !supportsVision) {
      return NextResponse.json(
        {
          error:
            "Este modelo não suporta imagens. Use Claude ou anexe um PDF.",
          code: "MODEL_NO_VISION",
        },
        { status: 400 },
      );
    }

    const { systemHint: attachmentsContext, userDocumentText } =
      await extractAttachments(workspaceId, fileParts);

    const systemPrompt = buildAgentSystemPrompt({
      baseSystem: aiSettings?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
      workspaceName: workspace.name,
      noteContext,
      enumeratedBlocks,
      selectionText,
      mentionsContext,
      attachmentsContext,
      skillLabel: skill?.label ?? null,
      skillPrompt: skill?.prompt ?? null,
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

    // PDFs/TXT → texto na mensagem do usuario; imagens → data URL para vision.
    const messagesForModel = [];
    for (const msg of messages as Array<{
      role?: string;
      parts?: unknown[];
      [key: string]: unknown;
    }>) {
      if (msg.role !== "user" || !Array.isArray(msg.parts)) {
        messagesForModel.push(msg);
        continue;
      }

      const nextParts: unknown[] = [];
      for (const part of msg.parts) {
        if (!part || typeof part !== "object") {
          nextParts.push(part);
          continue;
        }
        const p = part as UiFilePart;
        if (p.type !== "file") {
          nextParts.push(part);
          continue;
        }

        const media = p.mediaType ?? "";
        const filename = (p.filename ?? "").toLowerCase();
        if (
          media.includes("pdf") ||
          media.startsWith("text/") ||
          filename.endsWith(".pdf") ||
          filename.endsWith(".txt")
        ) {
          continue;
        }

        const publicPath = toStoragePublicPath(p.url ?? "");
        if (!media.startsWith("image/") || !publicPath) {
          continue;
        }

        const buffer = await getStorageObjectBuffer(publicPath);
        if (!buffer) continue;
        const dataUrl = `data:${media};base64,${buffer.toString("base64")}`;
        nextParts.push({
          ...p,
          url: dataUrl,
        });
      }

      messagesForModel.push({ ...msg, parts: nextParts });
    }

    if (userDocumentText) {
      const lastUserIdx = [...messagesForModel]
        .map((m, idx) => ({ m, idx }))
        .reverse()
        .find(({ m }) => m.role === "user")?.idx;
      if (lastUserIdx != null) {
        const target = messagesForModel[lastUserIdx] as {
          parts?: unknown[];
          [key: string]: unknown;
        };
        const parts = Array.isArray(target.parts) ? [...target.parts] : [];
        parts.push({ type: "text", text: userDocumentText });
        messagesForModel[lastUserIdx] = { ...target, parts };
      }
    }

    const thinkingEnabled = aiSettings?.thinkingEnabled ?? false;
    const providerOptions = buildThinkingProviderOptions(
      model.metadata,
      thinkingEnabled,
    );

    const result = streamText({
      model: model.build(),
      system: systemPrompt,
      messages: await convertToModelMessages(
        messagesForModel as Parameters<typeof convertToModelMessages>[0],
      ),
      tools,
      stopWhen: stepCountIs(6),
      experimental_transform: smoothStream({ chunking: "word", delayInMs: 15 }),
      ...(providerOptions ? { providerOptions } : {}),
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: Boolean(
        thinkingEnabled && model.metadata?.supportsThinking,
      ),
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
