"use client";

import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DefaultChatTransport,
  isToolUIPart,
  lastAssistantMessageIsCompleteWithApprovalResponses,
  type UIMessage,
} from "ai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useChatPanel } from "@/context/chatPanel";
import { useNoteEditor } from "@/context/noteEditor";
import { useWorkspace } from "@/context/workspace";
import { noteKeys } from "@/hook/notes/noteKeys";
import type { AiMessageMetadata } from "@/lib/ai/intent";
import type { AgentSkillId } from "@/lib/ai/skills";

export type AiUIMessage = UIMessage<AiMessageMetadata>;

export interface AgentMention {
  type: "note" | "noteCollection" | "resourceCollection" | "board";
  id: string;
  title: string;
}

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
  const { attachedSelection, clearAttachedSelection } = useChatPanel();
  const queryClient = useQueryClient();

  const noteIdRef = useRef(noteId);
  noteIdRef.current = noteId;

  const selectionRef = useRef<SelectionContext | null>(null);
  const skillIdRef = useRef<AgentSkillId | null>(null);
  const mentionsRef = useRef<AgentMention[]>([]);
  const isSendingRef = useRef(false);
  const invalidatedToolCallIdsRef = useRef<Set<string>>(new Set());

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

          const skillId = skillIdRef.current;
          const mentions = mentionsRef.current;
          skillIdRef.current = null;

          return {
            headers: { "x-workspace-id": workspaceId },
            body: {
              messages,
              noteId: currentNoteId,
              selectionContext,
              skillId: skillId ?? undefined,
              mentions: mentions.length ? mentions : undefined,
            },
          };
        },
      }),
    [attachedSelection, getSelectionContext, workspaceId],
  );

  const {
    messages,
    sendMessage,
    status,
    stop,
    setMessages,
    addToolOutput,
    addToolApprovalResponse,
  } = useChat<AiUIMessage>({
    transport,
    experimental_throttle: 30,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });

  // Mutations do Agent no servidor: invalida caches (sem espelhar no Yjs).
  useEffect(() => {
    for (const message of messages) {
      if (message.role !== "assistant") continue;
      for (const part of message.parts) {
        if (!isToolUIPart(part)) continue;
        if (part.state !== "output-available") continue;
        if (invalidatedToolCallIdsRef.current.has(part.toolCallId)) continue;

        const output = part.output as
          | {
              created?: boolean;
              deleted?: boolean;
              updated?: boolean;
              note?: { id?: string };
              resource?: { collectionId?: string };
            }
          | undefined;
        if (!output?.created && !output?.deleted && !output?.updated) continue;

        invalidatedToolCallIdsRef.current.add(part.toolCallId);

        switch (part.type) {
          case "tool-createNote":
          case "tool-deleteNote":
          case "tool-renameNote":
          case "tool-moveNote":
          case "tool-removeNoteText":
          case "tool-removeNoteBlock":
          case "tool-replaceNoteBlock":
            void queryClient.invalidateQueries({
              queryKey: noteKeys.all(workspaceId),
            });
            if (output.note?.id) {
              void queryClient.invalidateQueries({
                queryKey: noteKeys.detail(workspaceId, output.note.id),
              });
            }
            break;
          case "tool-createCollection":
          case "tool-deleteCollection":
            void queryClient.invalidateQueries({
              queryKey: ["collections", workspaceId],
            });
            void queryClient.invalidateQueries({
              queryKey: noteKeys.all(workspaceId),
            });
            void queryClient.invalidateQueries({ queryKey: ["resources"] });
            break;
          case "tool-createResource":
          case "tool-deleteResource":
            void queryClient.invalidateQueries({ queryKey: ["resources"] });
            if (output.resource?.collectionId) {
              void queryClient.invalidateQueries({
                queryKey: ["resources", output.resource.collectionId],
              });
            }
            break;
          default:
            break;
        }
      }
    }
  }, [messages, queryClient, workspaceId]);

  const isStreaming = status === "streaming" || status === "submitted";

  const send = useCallback(
    (
      text: string,
      options?: { skillId?: AgentSkillId; mentions?: AgentMention[] },
    ) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      const quote = attachedSelection
        ? {
            text: attachedSelection.text,
            noteId: attachedSelection.noteId,
          }
        : null;

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

      skillIdRef.current = options?.skillId ?? null;
      mentionsRef.current = options?.mentions ?? [];
      isSendingRef.current = true;

      void sendMessage({
        text: trimmed,
        metadata: quote
          ? {
              attachedSelection: {
                text: quote.text,
                noteId: quote.noteId,
              },
            }
          : undefined,
      });

      if (quote) clearAttachedSelection();
    },
    [
      attachedSelection,
      clearAttachedSelection,
      isStreaming,
      sendMessage,
    ],
  );

  const clear = useCallback(() => {
    selectionRef.current = null;
    skillIdRef.current = null;
    mentionsRef.current = [];
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
    addToolApprovalResponse,
  };
}
