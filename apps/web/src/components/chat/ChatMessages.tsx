"use client";

import { isToolUIPart, type ToolUIPart } from "ai";
import { ReplyIcon } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { MessageResponse } from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import type { NoteEditToolName, NoteEditToolResult } from "@/lib/ai/tools";
import { NOTE_EDIT_TOOLS } from "./agentToolLabels";
import {
  ChatDeleteConfirmation,
  isDeleteApprovalTool,
} from "./ChatDeleteConfirmation";
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
  addToolApprovalResponse: (args: {
    id: string;
    approved: boolean;
    reason?: string;
  }) => void | PromiseLike<void>;
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

function AttachedSelectionQuote({ text }: { text: string }) {
  const preview =
    text.length > 280 ? `${text.slice(0, 280).trimEnd()}…` : text;

  return (
    <div className="mb-1.5 flex max-w-[85%] items-start gap-2 self-end rounded-2xl border border-border/60 bg-muted/50 px-3 py-2 text-left">
      <ReplyIcon
        className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
        aria-hidden
      />
      <p className="min-w-0 flex-1 break-words text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground [overflow-wrap:anywhere]">
        {preview}
      </p>
    </div>
  );
}

export function ChatMessages({
  messages,
  isStreaming,
  noteId,
  addToolOutput,
  addToolApprovalResponse,
}: ChatMessagesProps) {
  const lastMessage = messages.at(-1);
  const isLastAssistantStreaming =
    isStreaming &&
    !!lastMessage &&
    lastMessage.role === "assistant" &&
    getMessageText(lastMessage).length === 0;

  return (
    <Conversation className="h-full min-h-0 min-w-0">
      <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-6">
        {messages.map((message) => {
          const isUser = message.role === "user";
          const reasoningText = isUser ? "" : getReasoningText(message);
          const userText = isUser ? getMessageText(message).trim() : "";
          const attachedQuote = isUser
            ? message.metadata?.attachedSelection?.text?.trim()
            : undefined;

          return (
            <div key={message.id} className="flex min-w-0 flex-col gap-3">
              {reasoningText ? (
                <Reasoning
                  key={`${message.id}-${isLastAssistantStreaming ? "streaming" : "done"}`}
                  isStreaming={isStreaming && isLastAssistantStreaming}
                >
                  <ReasoningTrigger />
                  <ReasoningContent>{reasoningText}</ReasoningContent>
                </Reasoning>
              ) : null}

              {isUser ? (
                userText || attachedQuote ? (
                  <div className="flex w-full flex-col items-end gap-1.5">
                    {attachedQuote ? (
                      <AttachedSelectionQuote text={attachedQuote} />
                    ) : null}
                    {userText ? (
                      <Bubble
                        variant="default"
                        align="end"
                        className="max-w-[85%] min-w-0"
                      >
                        <BubbleContent className="rounded-2xl break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
                          {userText}
                        </BubbleContent>
                      </Bubble>
                    ) : null}
                  </div>
                ) : null
              ) : (
                <div className="min-w-0 overflow-x-hidden text-sm leading-relaxed text-foreground">
                  {message.parts.map((part, idx) => {
                    if (part.type === "text") {
                      if (!part.text.trim()) return null;
                      return (
                        <MessageResponse key={`${message.id}-t-${idx}`}>
                          {part.text}
                        </MessageResponse>
                      );
                    }

                    if (isToolUIPart(part)) {
                      const toolPart = part as ToolUIPart;
                      const toolName = toolPart.type.replace(/^tool-/, "");

                      if (isDeleteApprovalTool(toolName)) {
                        return (
                          <ChatDeleteConfirmation
                            key={toolPart.toolCallId}
                            part={toolPart}
                            onRespond={(approvalId, approved) => {
                              void addToolApprovalResponse({
                                id: approvalId,
                                approved,
                              });
                            }}
                          />
                        );
                      }

                      if (!NOTE_EDIT_TOOLS.has(toolName) || !noteId) {
                        return null;
                      }
                      return (
                        <ChatToolPlanCard
                          key={toolPart.toolCallId}
                          part={toolPart}
                          noteId={noteId}
                          onResolve={(toolCallId, resolvedName, result) =>
                            addToolOutput({
                              tool: resolvedName,
                              toolCallId,
                              output: result,
                            })
                          }
                        />
                      );
                    }

                    return null;
                  })}
                </div>
              )}
            </div>
          );
        })}

        {isLastAssistantStreaming ? (
          <p className="text-sm text-muted-foreground animate-pulse">
            Pensando…
          </p>
        ) : null}
      </ConversationContent>
      <ConversationScrollButton
        className="rounded-full border-border bg-background shadow-sm"
        aria-label="Ir para o final"
      />
    </Conversation>
  );
}
