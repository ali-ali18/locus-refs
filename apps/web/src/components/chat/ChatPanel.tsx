"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
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
  const { messages, isStreaming, send, clear, stop } = useAiChat({ noteId });

  return (
    <div className="flex w-full flex-1 flex-col bg-sidebar text-sidebar-foreground">
      <ChatHeader onClear={clear} hasMessages={messages.length > 0} />
      <ChatMessages
        messages={messages}
        isStreaming={isStreaming}
        noteId={noteId}
      />
      <ChatInput
        onSend={send}
        onStop={stop}
        isStreaming={isStreaming}
        noteId={noteId}
      />
    </div>
  );
}

export function ChatPanel() {
  const { open, setOpen } = useChatPanel();
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const noteIdMatch = pathname.match(/\/notes\/([^/]+)$/);
  const noteId = noteIdMatch?.[1];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full p-0 sm:max-w-md [&>button]:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Assistente IA</SheetTitle>
            <SheetDescription>
              Painel de chat com o assistente de IA do workspace.
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
        "sticky top-0 hidden h-svh shrink-0 flex-col self-start border-l border-sidebar-border bg-sidebar",
        "overflow-hidden transition-[width] duration-200 ease-linear md:flex",
        open ? "w-96" : "w-0",
      )}
      aria-hidden={!open}
    >
      <div className="flex w-96 flex-1 flex-col">
        <ChatPanelContent noteId={noteId} />
      </div>
    </aside>
  );
}
