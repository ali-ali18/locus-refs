"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useMemo, useRef } from "react";
import { useChatPanel } from "@/context/chatPanel";
import { useNoteEditor } from "@/context/noteEditor";
import { useWorkspace } from "@/context/workspace";
import type { AiMessageMetadata } from "@/lib/ai/intent";

export type AiUIMessage = UIMessage<AiMessageMetadata>;

interface SelectionContext {
  hasSelection: boolean;
  from: number | null;
  to: number | null;
  text: string;
}

interface UseAiChatParams {
  noteId?: string;
}

export function useAiChat({ noteId }: UseAiChatParams) {
  const { workspaceId } = useWorkspace();
  const { getSelectionContext } = useNoteEditor();
  const { attachedSelection } = useChatPanel();

  const noteIdRef = useRef(noteId);
  noteIdRef.current = noteId;

  const selectionRef = useRef<SelectionContext | null>(null);
  const isSendingRef = useRef(false);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        prepareSendMessagesRequest: async ({ messages }) => {
          const currentNoteId = noteIdRef.current;
          const chip = selectionRef.current;

          let selectionContext: SelectionContext | null = null;

          if (chip) {
            selectionContext = chip;
          } else if (attachedSelection) {
            selectionContext = {
              hasSelection: true,
              from: attachedSelection.from,
              to: attachedSelection.to,
              text: attachedSelection.text,
            };
          } else {
            selectionContext = getSelectionContext(currentNoteId);
          }

          return {
            headers: { "x-workspace-id": workspaceId },
            body: {
              messages,
              noteId: currentNoteId,
              selectionContext,
            },
          };
        },
      }),
    [attachedSelection, getSelectionContext, workspaceId],
  );

  const { messages, sendMessage, status, stop, setMessages, addToolOutput } =
    useChat<AiUIMessage>({
      transport,
      experimental_throttle: 30,
    });

  const isStreaming = status === "streaming" || status === "submitted";

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      if (attachedSelection) {
        selectionRef.current = {
          hasSelection: true,
          from: attachedSelection.from,
          to: attachedSelection.to,
          text: attachedSelection.text,
        };
      } else {
        selectionRef.current = null;
      }

      isSendingRef.current = true;

      sendMessage({ text: trimmed });
    },
    [attachedSelection, isStreaming, sendMessage],
  );

  const clear = useCallback(() => {
    selectionRef.current = null;
    isSendingRef.current = false;
    setMessages([]);
  }, [setMessages]);

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
