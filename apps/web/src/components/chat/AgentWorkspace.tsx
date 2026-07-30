"use client";

import { useAgentSession } from "@/context/agentSession";
import { AgentActivityRail } from "./AgentActivityRail";
import { AgentEmptyState } from "./AgentEmptyState";
import { AgentHeader } from "./AgentHeader";
import { AgentThreadList } from "./AgentThreadList";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { Skeleton } from "../ui/skeleton";

export function AgentWorkspace() {
  const {
    messages,
    isStreaming,
    noteId,
    threadId,
    isThreadLoading,
    activeThread,
    send,
    stop,
    status,
    addToolOutput,
    addToolApprovalResponse,
  } = useAgentSession();

  const showChatSkeleton =
    !!threadId &&
    isThreadLoading &&
    (activeThread?.messageCount ?? 0) > 0;
  const isEmpty = messages.length === 0 && !showChatSkeleton;

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-background">
      <AgentThreadList />
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <AgentHeader />
        {showChatSkeleton ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <Skeleton className="h-40 w-full max-w-md rounded-xl" />
          </div>
        ) : isEmpty ? (
          <AgentEmptyState />
        ) : (
          <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
                <ChatMessages
                  messages={messages}
                  isStreaming={isStreaming}
                  noteId={noteId}
                  addToolOutput={addToolOutput}
                  addToolApprovalResponse={addToolApprovalResponse}
                />
              </div>
              <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-4 pt-2">
                <ChatInput
                  onSend={send}
                  onStop={stop}
                  status={status}
                  noteId={noteId}
                  variant="dock"
                />
              </div>
            </div>
            <AgentActivityRail />
          </div>
        )}
      </div>
    </div>
  );
}
