"use client";

import { BubbleChatIcon } from "@hugeicons/core-free-icons";
import { isToolUIPart, type ToolUIPart } from "ai";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNoteEditor } from "@/context/noteEditor";
import type { AiIntent } from "@/lib/ai/intent";
import { markdownToHtml } from "@/lib/ai/markdown-to-html";
import type { NoteEditToolName, NoteEditToolResult } from "@/lib/ai/tools";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { ChatToolCard } from "./ChatToolCard";
import type { AiUIMessage } from "./hook/useAiChat";

interface ChatMessagesProps {
  messages: AiUIMessage[];
  isStreaming: boolean;
  noteId?: string;
  addToolOutput: (args: {
    tool: NoteEditToolName;
    toolCallId: string;
    output: NoteEditToolResult;
  }) => void;
}

interface PlanToNoteActionProps {
  noteId: string;
  text: string;
}

const INTENT_PILL_LABELS: Record<AiIntent, string> = {
  chat: "Chat",
  plan: "Plano",
  suggestion: "Sugestão",
};

function MarkdownMessage({ text }: { text: string }) {
  const html = markdownToHtml(text);

  // biome-ignore lint/security/noDangerouslySetInnerHtml: markdownToHtml escapes raw HTML and emits a fixed tag set locally.
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function PlanToNoteAction({ noteId, text }: PlanToNoteActionProps) {
  const { canInsertIntoNote, queueProposalReview } = useNoteEditor();

  if (!canInsertIntoNote(noteId) || !text.trim()) return null;

  const handleClick = () => {
    const queued = queueProposalReview(noteId, text);
    if (queued) {
      toast.success("Plano enviado para revisão na nota.");
      return;
    }
    toast.error("Não foi possível abrir a revisão na nota.");
  };

  return (
    <Button
      variant="outline"
      size="xs"
      rounded="xl"
      className="mt-2"
      onClick={handleClick}
    >
      Transformar em nota
    </Button>
  );
}

export function ChatMessages({
  messages,
  isStreaming,
  noteId,
  addToolOutput,
}: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-sidebar-accent">
          <Icon
            icon={BubbleChatIcon}
            className="size-6 text-sidebar-foreground/70"
          />
        </div>
        <div className="space-y-1.5 text-center">
          <p className="text-sm font-semibold text-sidebar-foreground">
            Como posso ajudar?
          </p>
          <p className="mx-auto max-w-[220px] text-xs leading-relaxed text-muted-foreground">
            Pergunte sobre suas notas, peca resumos, sugestoes ou qualquer
            coisa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-4">
      <div className="flex-1" />
      {messages.map((message) => {
        const isUser = message.role === "user";
        const intent = message.metadata?.intent;
        const textBuffer: string[] = [];
        const renderedParts: React.ReactNode[] = [];

        let textChunkCount = 0;
        const flushText = () => {
          const text = textBuffer.join("");
          textBuffer.length = 0;
          if (!text.trim()) return;
          const key = `${message.id}-text-${textChunkCount}`;
          textChunkCount += 1;
          renderedParts.push(
            isUser ? (
              <span key={key}>{text}</span>
            ) : (
              <MarkdownMessage key={key} text={text} />
            ),
          );
        };

        for (const part of message.parts) {
          if (part.type === "text") {
            textBuffer.push(part.text);
            continue;
          }
          if (isToolUIPart(part) && noteId) {
            flushText();
            const toolPart = part as ToolUIPart;
            renderedParts.push(
              <ChatToolCard
                key={toolPart.toolCallId}
                part={toolPart}
                noteId={noteId}
                onResolve={(toolCallId, toolName, result) =>
                  addToolOutput({ tool: toolName, toolCallId, output: result })
                }
              />,
            );
          }
        }
        flushText();

        const text = message.parts
          .filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join("");

        return (
          <div
            key={message.id}
            className={cn(
              "flex w-full",
              isUser ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed wrap-break-word",
                isUser
                  ? "rounded-br-sm bg-primary text-primary-foreground"
                  : "rounded-bl-sm bg-sidebar-accent text-sidebar-foreground [&_a]:text-inherit [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-sidebar-border [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1 [&_code]:py-0.5 [&_em]:italic [&_h1]:mt-1 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:mt-1 [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:mt-1 [&_h3]:text-sm [&_h3]:font-medium [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/10 [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5",
              )}
            >
              {!isUser && intent && intent !== "chat" ? (
                <span className="mb-1.5 inline-flex items-center rounded-full bg-sidebar-foreground/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-sidebar-foreground/70">
                  {INTENT_PILL_LABELS[intent]}
                </span>
              ) : null}

              {renderedParts.length > 0 ? (
                renderedParts
              ) : isStreaming && !isUser ? (
                <span className="inline-flex items-center gap-1 py-0.5">
                  <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                  <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                  <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                </span>
              ) : null}

              {!isUser && noteId && !isStreaming && intent === "plan" ? (
                <PlanToNoteAction noteId={noteId} text={text} />
              ) : null}
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
