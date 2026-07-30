"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useChatPanel } from "@/context/chatPanel";
import { useIsMobile } from "@/hook/use-mobile";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { useAiChat } from "./hook/useAiChat";

function ChatPanelContent({ noteId }: { noteId?: string }) {
  const { messages, isStreaming, status, send, stop, addToolOutput } =
    useAiChat({ noteId, threadId: null });

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-sidebar text-sidebar-foreground">
      <ChatHeader
        onClear={() => undefined}
        hasMessages={messages.length > 0}
        noteId={noteId}
      />
      <ChatMessages
        messages={messages}
        isStreaming={isStreaming}
        noteId={noteId}
        addToolOutput={addToolOutput}
        addToolApprovalResponse={() => undefined}
      />
      <ChatInput onSend={send} onStop={stop} status={status} noteId={noteId} />
    </div>
  );
}

export function ChatPanel() {
  const { open, setOpen } = useChatPanel();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const noteIdMatch = pathname.match(/\/notes\/([^/]+)$/);
  const noteId = noteIdMatch?.[1];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  if (!mounted) return null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full p-0 sm:max-w-md [&>button]:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Agent</SheetTitle>
            <SheetDescription>
              Agent do workspace ativo para notas e acoes.
            </SheetDescription>
          </SheetHeader>
          <ChatPanelContent noteId={noteId} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-svh shrink-0 flex-col self-start border-l border-sidebar-border bg-sidebar overflow-hidden",
        "transition-[width] duration-200 ease-linear md:flex",
        open ? "w-96" : "w-0",
      )}
      aria-hidden={!open}
    >
      <div className="flex h-full w-96 flex-col">
        <ChatPanelContent noteId={noteId} />
      </div>
    </aside>
  );
}
