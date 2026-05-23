"use client";

import { BubbleChatIcon } from "@hugeicons/core-free-icons";
import type { UIMessage } from "ai";
import { isTextUIPart } from "ai";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNoteEditor } from "@/context/noteEditor";
import { markdownToHtml } from "@/lib/ai/markdown-to-html";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";

interface ChatMessagesProps {
  messages: UIMessage[];
  isStreaming: boolean;
  noteId?: string;
}

interface InsertMessageActionProps {
  noteId: string;
  text: string;
}

function MarkdownMessage({ text }: { text: string }) {
  const html = markdownToHtml(text);

  // biome-ignore lint/security/noDangerouslySetInnerHtml: markdownToHtml escapes raw HTML and emits a fixed tag set locally.
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function InsertMessageAction({ noteId, text }: InsertMessageActionProps) {
  const [open, setOpen] = useState(false);
  const { canInsertIntoNote, queueProposalReview } = useNoteEditor();

  if (!canInsertIntoNote(noteId) || !text.trim()) return null;

  const handleReview = () => {
    const queued = queueProposalReview(noteId, text);

    if (queued) {
      toast.success("Sugestao enviada para revisao na nota.");
      setOpen(false);
      return;
    }

    toast.error("Nao foi possivel abrir a revisao na nota.");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="xs"
        rounded="xl"
        className="mt-2"
        onClick={() => setOpen(true)}
      >
        Revisar na nota
      </Button>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Revisar conteudo na nota?</AlertDialogTitle>
          <AlertDialogDescription>
            A sugestao sera aberta acima do editor para voce revisar antes de
            aplicar na nota.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleReview}>
            Abrir revisao
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ChatMessages({
  messages,
  isStreaming,
  noteId,
}: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
    <div
      ref={scrollRef}
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-4"
    >
      {messages.map((message) => {
        const textParts = message.parts.filter(isTextUIPart);
        const text = textParts.map((p) => p.text).join("");
        const isUser = message.role === "user";

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
                "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words",
                isUser
                  ? "rounded-br-sm bg-primary text-primary-foreground"
                  : "rounded-bl-sm bg-sidebar-accent text-sidebar-foreground [&_a]:text-inherit [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-sidebar-border [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1 [&_code]:py-0.5 [&_em]:italic [&_h1]:mt-1 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:mt-1 [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:mt-1 [&_h3]:text-sm [&_h3]:font-medium [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/10 [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5",
              )}
            >
              {isUser ? (
                text
              ) : text ? (
                <MarkdownMessage text={text} />
              ) : isStreaming ? (
                <span className="inline-flex items-center gap-1 py-0.5">
                  <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                  <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                  <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                </span>
              ) : null}

              {!isUser && noteId && !isStreaming ? (
                <InsertMessageAction noteId={noteId} text={text} />
              ) : null}
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
