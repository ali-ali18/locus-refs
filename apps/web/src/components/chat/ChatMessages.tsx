"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import type { NoteEditToolName, NoteEditToolResult } from "@/lib/ai/tools";
import { ChatAssistantMessage } from "./ChatAssistantMessage";
import { ChatMessageChainOfThought } from "./ChatMessageChainOfThought";
import { ChatUserMessage } from "./ChatUserMessage";
import { getFileParts, getMessageText } from "./chatMessageParts";
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
      <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 pt-16 pb-[max(11.5rem,calc(10rem+env(safe-area-inset-bottom)))] md:pt-6 md:pb-36">
        {messages.map((message) => {
          const isUser = message.role === "user";
          const isThisAssistantStreaming =
            isStreaming && lastMessage?.id === message.id && !isUser;

          return (
            <div key={message.id} className="flex min-w-0 flex-col gap-3">
              {!isUser ? (
                <ChatMessageChainOfThought
                  message={message}
                  isStreaming={isThisAssistantStreaming}
                />
              ) : null}

              {isUser ? (
                <ChatUserMessage
                  text={getMessageText(message).trim()}
                  attachedQuote={message.metadata?.attachedSelection?.text?.trim()}
                  files={getFileParts(message)}
                />
              ) : (
                <ChatAssistantMessage
                  message={message}
                  noteId={noteId}
                  addToolOutput={addToolOutput}
                  addToolApprovalResponse={addToolApprovalResponse}
                />
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
