"use client";

import { getToolName, type ToolUIPart } from "ai";
import { useState } from "react";
import { toast } from "sonner";
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

interface ChatToolCardProps {
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
      className="prose prose-sm mt-2 max-h-48 overflow-y-auto rounded-lg bg-background/60 p-2 text-xs text-foreground/90 [&_a]:underline [&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1 [&_h1]:text-sm [&_h1]:font-semibold [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:text-xs [&_h3]:font-medium [&_ol]:list-decimal [&_ol]:pl-4 [&_p+p]:mt-2 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-black/10 [&_pre]:p-2 [&_ul]:list-disc [&_ul]:pl-4"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: markdownToHtml escapes raw HTML.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function ChatToolCard({ part, noteId, onResolve }: ChatToolCardProps) {
  const { applyToolOperation, getEnumeratedBlocks } = useNoteEditor();
  const [busy, setBusy] = useState(false);

  const toolName = getToolName(part);
  const known = isKnownToolName(toolName);
  const title = known ? TOOL_TITLES[toolName] : toolName;

  if (part.state === "input-streaming") {
    return (
      <div className="mt-2 rounded-xl border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 text-xs text-sidebar-foreground/70">
        <span className="font-medium">{title}</span> — gerando…
      </div>
    );
  }

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

  // input-available (or any other waiting state)
  if (!known) {
    return (
      <div className="mt-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
        Ferramenta desconhecida: {toolName}
      </div>
    );
  }

  const input = part.input as NoteEditToolInput["input"] | undefined;
  if (!input) return null;

  const blocks = getEnumeratedBlocks(noteId);
  const targetBlock =
    "blockIndex" in input ? blocks[input.blockIndex] : undefined;

  const handleApply = () => {
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
    <div className="mt-2 rounded-xl border border-sidebar-border bg-background/40 p-3 text-xs text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{title}</span>
        {"blockIndex" in input ? (
          <span className="rounded-full bg-sidebar-foreground/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-sidebar-foreground/70">
            bloco {input.blockIndex}
          </span>
        ) : null}
      </div>

      {targetBlock ? (
        <div className="mt-1 text-[11px] text-sidebar-foreground/60 line-clamp-2">
          Alvo: {targetBlock.preview || `(${targetBlock.type} vazio)`}
        </div>
      ) : "blockIndex" in input ? (
        <div className="mt-1 text-[11px] text-destructive">
          Bloco {input.blockIndex} não existe nesta nota.
        </div>
      ) : null}

      <ContentPreview markdown={input.content} />

      <div className="mt-2 flex justify-end gap-2">
        <Button
          variant="ghost"
          size="xs"
          rounded="xl"
          onClick={handleDeny}
          disabled={busy}
        >
          Descartar
        </Button>
        <Button
          variant="default"
          size="xs"
          rounded="xl"
          onClick={handleApply}
          disabled={busy}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
}
