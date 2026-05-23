"use client";

import { BubbleChatIcon } from "@hugeicons/core-free-icons";
import type { UIMessage } from "ai";
import { isTextUIPart } from "ai";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";

interface ChatMessagesProps {
  messages: UIMessage[];
  isStreaming: boolean;
}

export function ChatMessages({ messages, isStreaming }: ChatMessagesProps) {
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
          <Icon icon={BubbleChatIcon} className="size-6 text-sidebar-foreground/70" />
        </div>
        <div className="space-y-1.5 text-center">
          <p className="text-sm font-semibold text-sidebar-foreground">
            Como posso ajudar?
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground max-w-[220px] mx-auto">
            Pergunte sobre suas notas, peça resumos, sugestões ou qualquer coisa.
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
            className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
                isUser
                  ? "rounded-br-sm bg-primary text-primary-foreground"
                  : "rounded-bl-sm bg-sidebar-accent text-sidebar-foreground",
              )}
            >
              {text || (
                isStreaming && !isUser ? (
                  <span className="inline-flex items-center gap-1 py-0.5">
                    <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                    <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                    <span className="size-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                  </span>
                ) : null
              )}
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
