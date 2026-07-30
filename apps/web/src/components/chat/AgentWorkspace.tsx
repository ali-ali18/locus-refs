"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAgentSession } from "@/context/agentSession";
import { Skeleton } from "../ui/skeleton";
import { AgentActivityRail } from "./AgentActivityRail";
import { AgentEmptyState } from "./AgentEmptyState";
import { AgentHeader } from "./AgentHeader";
import { AgentThreadList } from "./AgentThreadList";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

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
  const [threadsOpen, setThreadsOpen] = useState(false);

  const showChatSkeleton =
    !!threadId &&
    isThreadLoading &&
    (activeThread?.messageCount ?? 0) > 0;
  const isEmpty = messages.length === 0 && !showChatSkeleton;

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-background">
      <div className="hidden h-full min-h-0 md:flex">
        <AgentThreadList variant="embedded" />
      </div>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <AgentHeader onOpenThreads={() => setThreadsOpen(true)} />
        {showChatSkeleton ? (
          <div className="flex flex-1 items-center justify-center p-6 pt-16">
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
              <div className="mx-auto w-full max-w-3xl shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 md:px-4 md:pb-4">
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

      <Sheet open={threadsOpen} onOpenChange={setThreadsOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-full max-w-sm gap-0 p-0 md:hidden"
        >
          <SheetTitle className="sr-only">Conversas</SheetTitle>
          <AgentThreadList
            variant="sheet"
            onThreadSelect={() => setThreadsOpen(false)}
            onClose={() => setThreadsOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
