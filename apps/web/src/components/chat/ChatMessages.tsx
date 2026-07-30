"use client";

import { isToolUIPart, type ToolUIPart } from "ai";
import { BrainIcon, ReplyIcon, WrenchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  Attachments,
  getAttachmentLabel,
} from "@/components/ai-elements/attachments";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { MessageResponse } from "@/components/ai-elements/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import type { NoteEditToolName, NoteEditToolResult } from "@/lib/ai/tools";
import {
  getToolCardSnippet,
  getToolCardTitle,
  getToolDoneLabel,
  getToolPendingLabel,
  NOTE_EDIT_TOOLS,
} from "./agentToolLabels";
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

function getFileParts(message: AiUIMessage) {
  return message.parts.filter(
    (part): part is Extract<(typeof message.parts)[number], { type: "file" }> =>
      part.type === "file",
  );
}

function getWorkspaceTools(message: AiUIMessage): ToolUIPart[] {
  return message.parts.filter((part): part is ToolUIPart => {
    if (!isToolUIPart(part)) return false;
    const name = part.type.replace(/^tool-/, "");
    return !NOTE_EDIT_TOOLS.has(name) && !isDeleteApprovalTool(name);
  });
}

function toolStepStatus(
  state: ToolUIPart["state"],
): "complete" | "active" | "pending" {
  switch (state) {
    case "output-available":
    case "output-error":
    case "output-denied":
      return "complete";
    case "input-streaming":
    case "input-available":
    case "approval-requested":
    case "approval-responded":
      return "active";
    default: {
      const _exhaustive: never = state;
      void _exhaustive;
      return "pending";
    }
  }
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

function cotHeaderLabel(params: {
  isStreaming: boolean;
  hasReasoning: boolean;
  toolCount: number;
}): string {
  const { isStreaming, hasReasoning, toolCount } = params;
  if (isStreaming) {
    if (toolCount > 0) return `Usando ferramentas (${toolCount})…`;
    return "Pensando…";
  }
  if (hasReasoning && toolCount > 0) {
    return `Raciocínio · ${toolCount} ferramenta${toolCount === 1 ? "" : "s"}`;
  }
  if (toolCount > 0) {
    return `${toolCount} ferramenta${toolCount === 1 ? "" : "s"}`;
  }
  return "Raciocínio";
}

function MessageChainOfThought({
  message,
  isStreaming,
}: {
  message: AiUIMessage;
  isStreaming: boolean;
}) {
  const reasoningText = getReasoningText(message);
  const workspaceTools = getWorkspaceTools(message);
  const hasReasoning = Boolean(reasoningText.trim());
  const hasContent = hasReasoning || workspaceTools.length > 0;

  // Com tools: permanece aberto para o usuario ver. So reasoning: fecha ao terminar.
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (isStreaming) {
      setOpen(true);
      return;
    }
    if (workspaceTools.length > 0) {
      setOpen(true);
      return;
    }
    if (hasReasoning) {
      const timer = setTimeout(() => setOpen(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [hasReasoning, isStreaming, workspaceTools.length]);

  if (!hasContent) return null;

  return (
    <ChainOfThought open={open} onOpenChange={setOpen} className="mb-1">
      <ChainOfThoughtHeader>
        {cotHeaderLabel({
          isStreaming,
          hasReasoning,
          toolCount: workspaceTools.length,
        })}
      </ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        {hasReasoning ? (
          <ChainOfThoughtStep
            icon={BrainIcon}
            label="Pensamento"
            description={
              <span className="whitespace-pre-wrap">{reasoningText}</span>
            }
            status={isStreaming && workspaceTools.length === 0 ? "active" : "complete"}
          />
        ) : null}
        {workspaceTools.map((toolPart) => {
          const snippet = getToolCardSnippet(toolPart);
          return (
            <ChainOfThoughtStep
              key={toolPart.toolCallId}
              icon={WrenchIcon}
              label={getToolCardTitle(toolPart)}
              description={
                snippet ||
                (toolPart.state === "output-available" ||
                toolPart.state === "output-error"
                  ? getToolDoneLabel(toolPart)
                  : getToolPendingLabel(toolPart))
              }
              status={toolStepStatus(toolPart.state)}
            />
          );
        })}
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}

function UserFileAttachments({
  files,
}: {
  files: ReturnType<typeof getFileParts>;
}) {
  if (files.length === 0) return null;

  return (
    <Attachments variant="inline" className="mb-1.5 ml-auto max-w-[85%] justify-end">
      {files.map((file, idx) => {
        const data = {
          id: `${file.url}-${idx}`,
          type: "file" as const,
          url: file.url,
          mediaType: file.mediaType,
          filename: file.filename,
        };
        return (
          <Attachment key={data.id} data={data}>
            <AttachmentPreview />
            <AttachmentInfo />
            <span className="sr-only">{getAttachmentLabel(data)}</span>
          </Attachment>
        );
      })}
    </Attachments>
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
          const userText = isUser ? getMessageText(message).trim() : "";
          const userFiles = isUser ? getFileParts(message) : [];
          const attachedQuote = isUser
            ? message.metadata?.attachedSelection?.text?.trim()
            : undefined;
          const isThisAssistantStreaming =
            isStreaming && lastMessage?.id === message.id && !isUser;

          return (
            <div key={message.id} className="flex min-w-0 flex-col gap-3">
              {!isUser ? (
                <MessageChainOfThought
                  message={message}
                  isStreaming={isThisAssistantStreaming}
                />
              ) : null}

              {isUser ? (
                userText || attachedQuote || userFiles.length > 0 ? (
                  <div className="flex w-full flex-col items-end gap-1.5">
                    {attachedQuote ? (
                      <AttachedSelectionQuote text={attachedQuote} />
                    ) : null}
                    <UserFileAttachments files={userFiles} />
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
