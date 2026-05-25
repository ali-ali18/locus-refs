"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef } from "react";
import { useChatPanel } from "@/context/chatPanel";
import { useNoteEditor } from "@/context/noteEditor";
import { useWorkspace } from "@/context/workspace";
import type { AiMessageMetadata } from "@/lib/ai/intent";

export type AiUIMessage = UIMessage<AiMessageMetadata>;

interface UseAiChatParams {
  noteId?: string;
}

export function useAiChat({ noteId }: UseAiChatParams) {
  const { workspaceId } = useWorkspace();
  const { getSelectionContext } = useNoteEditor();
  const { attachedSelection, clearAttachedSelection } = useChatPanel();

  const noteIdRef = useRef(noteId);
  noteIdRef.current = noteId;

  const attachedSelectionRef = useRef(attachedSelection);
  attachedSelectionRef.current = attachedSelection;

  useEffect(() => {
    attachedSelectionRef.current = attachedSelection;
  }, [attachedSelection]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        prepareSendMessagesRequest: async ({ messages }) => {
          const currentNoteId = noteIdRef.current;
          const chip = attachedSelectionRef.current;
          const useChip = !!(chip && chip.text && chip.text.length > 0);

          return {
            headers: { "x-workspace-id": workspaceId },
            body: {
              messages,
              noteId: currentNoteId,
              selectionContext: useChip
                ? {
                    hasSelection: true,
                    from: chip.from,
                    to: chip.to,
                    text: chip.text,
                  }
                : chip
                  ? { hasSelection: true, from: chip.from, to: chip.to, text: chip.text }
                  : getSelectionContext(currentNoteId),
            },
          };
        },
      }),
    [getSelectionContext, workspaceId],
  );

  const { messages, sendMessage, status, stop, setMessages, addToolOutput } =
    useChat<AiUIMessage>({
      transport,
      experimental_throttle: 30,
    });

  const isStreaming = status === "streaming" || status === "submitted";

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const chipToSend = attachedSelection;

    sendMessage({ text: trimmed });

    if (chipToSend) clearAttachedSelection();
  };

  const clear = () => setMessages([]);

  return {
    messages,
    isStreaming,
    send,
    clear,
    stop,
    status,
    addToolOutput,
  };
}