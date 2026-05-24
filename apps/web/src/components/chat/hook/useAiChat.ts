"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useRef } from "react";
import { useNoteEditor } from "@/context/noteEditor";
import { useWorkspace } from "@/context/workspace";

interface UseAiChatParams {
  noteId?: string;
}

export function useAiChat({ noteId }: UseAiChatParams) {
  const { workspaceId } = useWorkspace();
  const { getSelectionContext } = useNoteEditor();

  const noteIdRef = useRef(noteId);
  noteIdRef.current = noteId;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        prepareSendMessagesRequest: async ({ messages }) => ({
          headers: { "x-workspace-id": workspaceId },
          body: {
            messages,
            noteId: noteIdRef.current,
            selectionContext: getSelectionContext(noteIdRef.current),
          },
        }),
      }),
    [getSelectionContext, workspaceId],
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
