"use client";

import { getToolName, type ToolUIPart } from "ai";
import { CheckIcon, XIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation";
import { useNoteEditor } from "@/context/noteEditor";
import { markdownToHtml } from "@/lib/ai/markdown-to-html";
import type {
  NoteEditToolInput,
  NoteEditToolName,
  NoteEditToolResult,
} from "@/lib/ai/tools";

type NoteEditToolPart = ToolUIPart;

interface ChatToolPlanCardProps {
  part: NoteEditToolPart;
  noteId: string;
  onResolve: (
    toolCallId: string,
    toolName: NoteEditToolName,
    result: NoteEditToolResult,
  ) => void;
}

const TOOL_TITLES: Record<NoteEditToolName, string> = {
  appendToEnd: "Anexar no fim da nota",
  insertAfterBlock: "Inserir depois do bloco",
  insertBeforeBlock: "Inserir antes do bloco",
  replaceBlock: "Substituir bloco",
  replaceSelection: "Substituir seleção",
  replaceEntireNote: "Reescrever nota inteira",
  insertWikiLinks: "Inserir wiki-links",
};

const KNOWN_TOOL_NAMES: NoteEditToolName[] = [
  "appendToEnd",
  "insertAfterBlock",
  "insertBeforeBlock",
  "replaceBlock",
  "replaceSelection",
  "replaceEntireNote",
  "insertWikiLinks",
];

function isKnownToolName(name: string): name is NoteEditToolName {
  return (KNOWN_TOOL_NAMES as string[]).includes(name);
}

function ContentPreview({ markdown }: { markdown: string }) {
  const html = markdownToHtml(markdown);
  return (
    <div
      className="prose prose-sm max-h-64 max-w-none overflow-y-auto text-sm text-foreground/90 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:text-sm [&_h2]:text-sm [&_h3]:text-sm [&_ol]:list-decimal [&_ol]:pl-4 [&_p+p]:mt-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-muted [&_pre]:p-2 [&_ul]:list-disc [&_ul]:pl-4"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: markdownToHtml escapes raw HTML.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Note-edit tools are client-side (no `needsApproval`): they stay in
 * `input-available` until `addToolOutput`. Map that onto the Confirmation
 * approval UI contract used by delete tools.
 */
function toConfirmationProps(part: NoteEditToolPart): {
  approval: { id: string; approved?: boolean };
  state: ToolUIPart["state"];
} | null {
  if (part.state === "input-streaming") return null;

  if (part.state === "input-available") {
    return {
      approval: { id: part.toolCallId },
      state: "approval-requested",
    };
  }

  if (part.state === "output-denied") {
    return {
      approval: { id: part.toolCallId, approved: false },
      state: "output-denied",
    };
  }

  if (part.state === "output-available") {
    const output = part.output as NoteEditToolResult | undefined;
    if (output?.status === "denied") {
      return {
        approval: { id: part.toolCallId, approved: false },
        state: "output-available",
      };
    }
    if (output?.status === "applied") {
      return {
        approval: { id: part.toolCallId, approved: true },
        state: "output-available",
      };
    }
  }

  return null;
}

export function ChatToolPlanCard({
  part,
  noteId,
  onResolve,
}: ChatToolPlanCardProps) {
  const { applyToolOperation, getEnumeratedBlocks } = useNoteEditor();
  const [busy, setBusy] = useState(false);

  const toolName = getToolName(part);
  const known = isKnownToolName(toolName);
  const title = known ? TOOL_TITLES[toolName] : toolName;

  if (
    part.state === "output-error" ||
    (part.state === "output-available" &&
      (part.output as NoteEditToolResult | undefined)?.status === "error")
  ) {
    const errorReason =
      part.state === "output-error"
        ? part.errorText
        : (part.output as NoteEditToolResult).reason;

    return (
      <div className="mt-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
        <span className="font-medium">{title}</span>
        {errorReason ? ` — erro: ${errorReason}` : " — erro"}
      </div>
    );
  }

  if (!known) {
    return (
      <div className="mt-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
        Ferramenta desconhecida: {toolName}
      </div>
    );
  }

  const confirmation = toConfirmationProps(part);
  if (!confirmation) return null;

  const input = part.input as NoteEditToolInput["input"] | undefined;
  const isRequesting = confirmation.state === "approval-requested";

  const handleDeny = () => {
    onResolve(part.toolCallId, toolName, { status: "denied" });
  };

  const handleAccept = () => {
    if (!input) return;
    setBusy(true);
    const op = { name: toolName, input } as NoteEditToolInput;
    const result = applyToolOperation(noteId, op);
    if (result.status === "applied") {
      toast.success(`${title} aplicado.`);
    } else if (result.status === "error") {
      toast.error(result.reason ?? "Falha ao aplicar.");
    }
    onResolve(part.toolCallId, toolName, result);
    setBusy(false);
  };

  const aiTitle =
    input && "title" in input && input.title?.trim()
      ? input.title.trim()
      : title;

  let requestDescription = title;
  let preview: ReactNode = null;

  if (input && toolName === "insertWikiLinks" && "links" in input) {
    requestDescription = `Inserir ${input.links.length} wiki-link(s) na nota`;
    preview = (
      <>
        {input.intro?.trim() ? (
          <p className="mb-2 text-sm text-muted-foreground">{input.intro}</p>
        ) : null}
        <ul className="flex flex-col gap-1.5 text-sm">
          {input.links.map((link) => (
            <li key={link.noteId} className="text-foreground">
              [[{link.title}]]
            </li>
          ))}
        </ul>
      </>
    );
  } else if (input && "content" in input) {
    const blocks = getEnumeratedBlocks(noteId);
    const targetBlock =
      "blockIndex" in input ? blocks[input.blockIndex] : undefined;
    const blocoLabel =
      "blockIndex" in input ? `bloco ${input.blockIndex}` : null;
    const blockMissing = !targetBlock && blocoLabel !== null;

    requestDescription = targetBlock
      ? `${title} · ${targetBlock.preview || `(${targetBlock.type} vazio)`}`
      : blockMissing
        ? `${title} · ${blocoLabel} não existe nesta nota`
        : title;

    preview = input.content.trim() ? (
      <ContentPreview markdown={input.content} />
    ) : (
      <p className="text-sm text-muted-foreground italic">
        O conteúdo do alvo será removido.
      </p>
    );
  }

  return (
    <Confirmation
      approval={confirmation.approval}
      state={confirmation.state}
      className="mt-2 rounded-xl"
    >
      <ConfirmationTitle>
        <ConfirmationRequest>
          <span className="font-medium text-foreground">{aiTitle}</span>
          <br />
          <span className="text-muted-foreground">{requestDescription}</span>
        </ConfirmationRequest>
        <ConfirmationAccepted>
          <span className="inline-flex items-center gap-1.5">
            <CheckIcon className="size-4" />
            {aiTitle} — aplicado
          </span>
        </ConfirmationAccepted>
        <ConfirmationRejected>
          <span className="inline-flex items-center gap-1.5">
            <XIcon className="size-4" />
            {aiTitle} — descartado
          </span>
        </ConfirmationRejected>
      </ConfirmationTitle>

      {isRequesting && preview ? (
        <div className="mt-1 rounded-xl border border-border bg-background/60 p-3">
          {preview}
        </div>
      ) : null}

      <ConfirmationActions>
        <ConfirmationAction
          variant="outline"
          disabled={busy || !input}
          onClick={handleDeny}
        >
          Recusar
        </ConfirmationAction>
        <ConfirmationAction
          disabled={busy || !input}
          onClick={handleAccept}
        >
          Aceitar
        </ConfirmationAction>
      </ConfirmationActions>
    </Confirmation>
  );
}
