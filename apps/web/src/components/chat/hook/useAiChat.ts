"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useMemo, useRef } from "react";
import { useWorkspace } from "@/context/workspace";

interface UseAiChatParams {
  noteId?: string;
}

export function useAiChat({ noteId }: UseAiChatParams) {
  const { workspaceId } = useWorkspace();

  const noteIdRef = useRef(noteId);
  noteIdRef.current = noteId;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        prepareSendMessagesRequest: async ({ messages }) => ({
          headers: { "x-workspace-id": workspaceId },
          body: { messages, noteId: noteIdRef.current },
        }),
      }),
    [workspaceId],
  );

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport,
    experimental_throttle: 30,
  });

  const isStreaming = status === "streaming" || status === "submitted";

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    sendMessage({ text: trimmed });
  };

  const clear = () => setMessages([]);

  return { messages, isStreaming, send, clear, stop, status };
}
