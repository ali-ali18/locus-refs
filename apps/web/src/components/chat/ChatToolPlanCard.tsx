"use client";

import { getToolName, type ToolUIPart } from "ai";
import { Check, FileText, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanFooter,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "@/components/ai-elements/plan";
import { Button } from "@/components/ui/button";
import { useNoteEditor } from "@/context/noteEditor";
import { markdownToHtml } from "@/lib/ai/markdown-to-html";
import type {
  NoteEditToolInput,
  NoteEditToolName,
  NoteEditToolResult,
} from "@/lib/ai/tools";
import { cn } from "@/lib/utils";

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
};

const KNOWN_TOOL_NAMES: NoteEditToolName[] = [
  "appendToEnd",
  "insertAfterBlock",
  "insertBeforeBlock",
  "replaceBlock",
  "replaceSelection",
  "replaceEntireNote",
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

  // Estados terminais: aprovado, negado, erro — linha fina de status
  if (
    part.state === "output-available" ||
    part.state === "output-error" ||
    part.state === "output-denied"
  ) {
    const output =
      part.state === "output-available"
        ? (part.output as NoteEditToolResult | undefined)
        : undefined;
    const isApplied = output?.status === "applied";
    const isDenied =
      output?.status === "denied" || part.state === "output-denied";
    const errorReason =
      output?.status === "error"
        ? output.reason
        : part.state === "output-error"
          ? part.errorText
          : undefined;

    return (
      <div
        className={cn(
          "mt-2 rounded-xl border px-3 py-2 text-xs",
          isApplied
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            : isDenied
              ? "border-sidebar-border bg-sidebar-accent/40 text-sidebar-foreground/60"
              : "border-destructive/30 bg-destructive/10 text-destructive",
        )}
      >
        <span className="font-medium">{title}</span>
        {isApplied
          ? " — aplicado"
          : isDenied
            ? " — descartado"
            : errorReason
              ? ` — erro: ${errorReason}`
              : null}
      </div>
    );
  }

  // Tool desconhecido: avisa
  if (!known) {
    return (
      <div className="mt-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
        Ferramenta desconhecida: {toolName}
      </div>
    );
  }

  // input-streaming: nada a renderizar ainda (input incompleto). O typing dot
  // no ChatMessages cuida do feedback visual durante a stream.
  if (part.state === "input-streaming") {
    return null;
  }

  // input-available: este é o caso do "Aceitar ou recusar"
  const input = part.input as NoteEditToolInput["input"] | undefined;
  if (!input) return null;

  const blocks = getEnumeratedBlocks(noteId);
  const targetBlock =
    "blockIndex" in input ? blocks[input.blockIndex] : undefined;
  const blocoLabel = "blockIndex" in input ? `bloco ${input.blockIndex}` : null;
  const blockMissing = !targetBlock && blocoLabel !== null;
  const aiTitle = input.title?.trim() || title;
  const description = targetBlock
    ? `${title} · ${targetBlock.preview || `(${targetBlock.type} vazio)`}`
    : blockMissing
      ? `${title} · ${blocoLabel} não existe nesta nota`
      : title;

  const handleAccept = () => {
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

  const handleDeny = () => {
    onResolve(part.toolCallId, toolName, { status: "denied" });
  };

  return (
    <Plan defaultOpen className="mt-2 w-full">
      <PlanHeader>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <PlanTitle>{aiTitle}</PlanTitle>
          </div>
          <PlanDescription className={blockMissing ? "text-destructive" : ""}>
            {description}
          </PlanDescription>
        </div>
        <PlanTrigger />
      </PlanHeader>
      <PlanContent>
        {input.content.trim() ? (
          <ContentPreview markdown={input.content} />
        ) : (
          <p className="text-sm text-muted-foreground italic">
            O conteúdo do alvo será removido.
          </p>
        )}
      </PlanContent>
      <PlanFooter className="justify-end">
        <PlanAction className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeny}
            disabled={busy}
          >
            <X className="size-4" />
            Recusar
          </Button>
          <Button size="sm" onClick={handleAccept} disabled={busy}>
            <Check className="size-4" />
            Aceitar
          </Button>
        </PlanAction>
      </PlanFooter>
    </Plan>
  );
}
