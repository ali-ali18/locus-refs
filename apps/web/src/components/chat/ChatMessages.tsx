"use client";

import { Cancel01Icon, QuoteUpIcon } from "@hugeicons/core-free-icons";
import { isToolUIPart, type ToolUIPart } from "ai";
import { BrainIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Button } from "@/components/ui/button";
import { useChatPanel } from "@/context/chatPanel";
import { useNoteEditor } from "@/context/noteEditor";
import type { NoteEditToolName, NoteEditToolResult } from "@/lib/ai/tools";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { ChatToolPlanCard } from "./ChatToolPlanCard";
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

function getMessageText(message: AiUIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function getReasoningText(message: AiUIMessage): string {
  return message.parts
    .filter((part) => part.type === "reasoning")
    .map((part) => (part as { text: string }).text)
    .join("");
}

export function ChatMessages({
  messages,
  isStreaming,
  noteId,
  addToolOutput,
}: ChatMessagesProps) {
  const { attachedSelection, clearAttachedSelection } = useChatPanel();
  const lastMessage = messages.at(-1);
  const isLastAssistantStreaming =
    isStreaming &&
    !!lastMessage &&
    lastMessage.role === "assistant" &&
    getMessageText(lastMessage).length === 0;

  if (messages.length === 0) {
    return (
      <Conversation className="flex-1">
        <ConversationContent className="items-center justify-center">
          <ConversationEmptyState
            title="Como posso ajudar?"
            description="Pergunte sobre suas notas, peca resumos, sugestoes ou qualquer coisa."
            icon={
              <div className="flex size-14 items-center justify-center rounded-2xl bg-sidebar-accent">
                <BrainIcon className="size-6 text-sidebar-foreground/70" />
              </div>
            }
          />
        </ConversationContent>
      </Conversation>
    );
  }

  return (
    <Conversation className="flex-1">
      <ConversationContent>
        {attachedSelection ? (
          <div className="mx-3 mb-2 flex items-center gap-2 rounded-xl border border-sidebar-border bg-sidebar-accent/50 px-3 py-1.5 text-xs text-sidebar-foreground">
            <Icon icon={QuoteUpIcon} className="size-3.5 shrink-0" />
            <span className="truncate">
              {attachedSelection.text.length > 40
                ? `${attachedSelection.text.slice(0, 40)}…`
                : attachedSelection.text}
            </span>
            <button
              type="button"
              onClick={clearAttachedSelection}
              className="ml-auto rounded-full p-0.5 text-sidebar-foreground/60 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
              aria-label="Remover trecho anexado"
            >
              <Icon icon={Cancel01Icon} className="size-3" />
            </button>
          </div>
        ) : null}

        {messages.map((message) => {
          const isUser = message.role === "user";
          const intent = message.metadata?.intent;
          const reasoningText = isUser ? "" : getReasoningText(message);

          return (
            <div key={message.id} className="flex flex-col gap-2">
              {reasoningText ? (
                <Reasoning
                  key={`${message.id}-${isLastAssistantStreaming ? "streaming" : "done"}`}
                  isStreaming={isStreaming && isLastAssistantStreaming}
                  className="px-3"
                >
                  <ReasoningTrigger />
                  <ReasoningContent>{reasoningText}</ReasoningContent>
                </Reasoning>
              ) : null}

              <Message from={message.role}>
                <MessageContent
                  className={cn(
                    isUser
                      ? "rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-primary-foreground"
                      : "w-full text-sm",
                  )}
                >
                  {message.parts.map((part, idx) => {
                    if (part.type === "text") {
                      if (!part.text.trim()) return null;
                      if (isUser) {
                        return (
                          <span key={`${message.id}-t-${idx}`}>
                            {part.text}
                          </span>
                        );
                      }
                      return (
                        <MessageResponse key={`${message.id}-t-${idx}`}>
                          {part.text}
                        </MessageResponse>
                      );
                    }
                    if (isToolUIPart(part) && noteId) {
                      const toolPart = part as ToolUIPart;
                      return (
                        <ChatToolPlanCard
                          key={toolPart.toolCallId}
                          part={toolPart}
                          noteId={noteId}
                          onResolve={(toolCallId, toolName, result) =>
                            addToolOutput({
                              tool: toolName,
                              toolCallId,
                              output: result,
                            })
                          }
                        />
                      );
                    }
                    return null;
                  })}

                  {!isUser && noteId && !isStreaming && intent === "plan" ? (
                    <PlanToNoteAction
                      noteId={noteId}
                      text={getMessageText(message)}
                    />
                  ) : null}
                </MessageContent>
              </Message>
            </div>
          );
        })}

        {isLastAssistantStreaming ? (
          <span className="text-muted-foreground px-3 inline-flex items-center gap-1 py-1">
            <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
            <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
            <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
          </span>
        ) : null}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
