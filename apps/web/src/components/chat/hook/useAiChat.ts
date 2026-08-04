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
import { agentSkillKeys } from "@/hook/ai/agentSkillKeys";
import { agentThreadKeys } from "@/hook/ai/agentThreadKeys";
import { useAgentThread, useAgentThreadMutations } from "@/hook/ai/useAgentThreads";
import { kanbanKeys } from "@/hook/kanban/kanbanKeys";
import { noteKeys } from "@/hook/notes/noteKeys";
import type { AiMessageMetadata } from "@/lib/ai/intent";
import { deleteChatUploads } from "@/lib/chat-upload-cleanup";
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
  threadId: string | null;
  /** Chamado quando a 1ª mensagem cria a thread no banco. */
  onThreadCreated?: (threadId: string) => void;
}

export interface ChatAttachment {
  url: string;
  mediaType: string;
  filename: string;
}

type PendingSend = {
  text: string;
  options?: {
    skillId?: AgentSkillId;
    mentions?: AgentMention[];
    attachments?: ChatAttachment[];
  };
};

export function useAiChat({
  noteId,
  threadId,
  onThreadCreated,
}: UseAiChatParams) {
  const { workspaceId } = useWorkspace();
  const { getSelectionContext } = useNoteEditor();
  const { attachedSelection, clearAttachedSelection } = useChatPanel();
  const queryClient = useQueryClient();
  const { data: threadDetail, isLoading: isThreadLoading } =
    useAgentThread(threadId);
  const { saveThread, createThread } = useAgentThreadMutations();

  const noteIdRef = useRef(noteId);
  noteIdRef.current = noteId;
  const threadIdRef = useRef(threadId);
  threadIdRef.current = threadId;
  const onThreadCreatedRef = useRef(onThreadCreated);
  onThreadCreatedRef.current = onThreadCreated;

  const selectionRef = useRef<SelectionContext | null>(null);
  const skillIdRef = useRef<AgentSkillId | null>(null);
  const mentionsRef = useRef<AgentMention[]>([]);
  const attachmentsRef = useRef<ChatAttachment[]>([]);
  const isSendingRef = useRef(false);
  const invalidatedToolCallIdsRef = useRef<Set<string>>(new Set());
  const hydratedThreadIdRef = useRef<string | null>(null);
  const skipPersistOnceRef = useRef(false);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSendRef = useRef<PendingSend | null>(null);
  const creatingThreadRef = useRef(false);

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
          const attachments = attachmentsRef.current;
          skillIdRef.current = null;
          attachmentsRef.current = [];

          return {
            headers: { "x-workspace-id": workspaceId },
            body: {
              messages,
              noteId: currentNoteId,
              threadId: threadIdRef.current ?? undefined,
              selectionContext,
              skillId: skillId ?? undefined,
              mentions: mentions.length ? mentions : undefined,
              attachments: attachments.length ? attachments : undefined,
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
    id: threadId ?? undefined,
    transport,
    experimental_throttle: 30,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });

  useEffect(() => {
    if (!threadId) {
      hydratedThreadIdRef.current = null;
      setMessages([]);
      return;
    }
    if (hydratedThreadIdRef.current !== threadId) {
      setMessages([]);
    }
  }, [threadId, setMessages]);

  useEffect(() => {
    if (!threadId) return;
    if (!threadDetail || threadDetail.id !== threadId) return;
    if (hydratedThreadIdRef.current === threadId) return;
    hydratedThreadIdRef.current = threadId;
    skipPersistOnceRef.current = true;
    const loaded = Array.isArray(threadDetail.messages)
      ? (threadDetail.messages as AiUIMessage[])
      : [];
    setMessages(loaded);
  }, [threadDetail, threadId, setMessages]);

  useEffect(() => {
    if (!threadId) return;
    if (status !== "ready") return;
    if (hydratedThreadIdRef.current !== threadId) return;
    if (skipPersistOnceRef.current) {
      skipPersistOnceRef.current = false;
      return;
    }
    if (messages.length === 0) return;

    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      const firstUser = messages.find((m) => m.role === "user");
      const firstText =
        firstUser?.parts
          ?.filter((p) => p.type === "text")
          .map((p) => (p as { text: string }).text)
          .join("")
          .trim() ?? "";
      const shouldSetTitle = messages.length > 0 && messages.length <= 2;
      const autoTitle =
        shouldSetTitle && firstText.length > 0
          ? firstText.slice(0, 60) + (firstText.length > 60 ? "…" : "")
          : undefined;

      void saveThread({
        threadId,
        messages,
        ...(autoTitle ? { title: autoTitle } : {}),
      }).then(() => {
        void queryClient.invalidateQueries({
          queryKey: agentThreadKeys.all(workspaceId),
        });
      });
    }, 400);

    return () => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    };
  }, [messages, queryClient, saveThread, status, threadId, workspaceId]);

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
              boardId?: string;
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
          case "tool-createKanbanCard":
          case "tool-updateKanbanCard":
          case "tool-moveKanbanCard":
            void queryClient.invalidateQueries({
              queryKey: kanbanKeys.all(workspaceId),
            });
            if (output.boardId) {
              void queryClient.invalidateQueries({
                queryKey: kanbanKeys.detail(workspaceId, output.boardId),
              });
            }
            break;
          case "tool-createAgentSkill":
            void queryClient.invalidateQueries({
              queryKey: agentSkillKeys.all(workspaceId),
            });
            break;
          default:
            break;
        }
      }
    }
  }, [messages, queryClient, workspaceId]);

  const isStreaming = status === "streaming" || status === "submitted";

  const dispatchSend = useCallback(
    (
      text: string,
      options?: {
        skillId?: AgentSkillId;
        mentions?: AgentMention[];
        attachments?: ChatAttachment[];
      },
    ) => {
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
      attachmentsRef.current = options?.attachments ?? [];
      isSendingRef.current = true;

      const files = (options?.attachments ?? []).map((file) => ({
        type: "file" as const,
        url: file.url,
        mediaType: file.mediaType,
        filename: file.filename,
      }));

      void sendMessage({
        text,
        files: files.length ? files : undefined,
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
    [attachedSelection, clearAttachedSelection, sendMessage],
  );

  /** Depois de criar a thread, dispara o envio que ficou pendente. */
  useEffect(() => {
    if (!threadId || !pendingSendRef.current) return;
    if (hydratedThreadIdRef.current !== threadId) return;
    if (status !== "ready") return;

    const pending = pendingSendRef.current;
    pendingSendRef.current = null;
    creatingThreadRef.current = false;
    dispatchSend(pending.text, pending.options);
  }, [dispatchSend, status, threadId, threadDetail]);

  const send = useCallback(
    (
      text: string,
      options?: {
        skillId?: AgentSkillId;
        mentions?: AgentMention[];
        attachments?: ChatAttachment[];
      },
    ) => {
      const trimmed = text.trim();
      const hasAttachments = (options?.attachments?.length ?? 0) > 0;
      if (
        (!trimmed && !hasAttachments) ||
        isStreaming ||
        creatingThreadRef.current
      ) {
        return;
      }

      if (threadIdRef.current) {
        dispatchSend(trimmed, options);
        return;
      }

      if (!onThreadCreatedRef.current) return;

      creatingThreadRef.current = true;
      pendingSendRef.current = { text: trimmed, options };
      const titleSource =
        trimmed || options?.attachments?.[0]?.filename || "Anexo";
      const title =
        titleSource.slice(0, 60) + (titleSource.length > 60 ? "…" : "");

      void createThread({ visibility: "private", title })
        .then((thread) => {
          threadIdRef.current = thread.id;
          onThreadCreatedRef.current?.(thread.id);
        })
        .catch(() => {
          const orphanUrls =
            pendingSendRef.current?.options?.attachments?.map((a) => a.url) ??
            [];
          pendingSendRef.current = null;
          creatingThreadRef.current = false;
          if (orphanUrls.length > 0) {
            void deleteChatUploads(orphanUrls);
          }
        });
    },
    [createThread, dispatchSend, isStreaming],
  );

  return {
    messages,
    isStreaming,
    isThreadLoading: !!threadId && isThreadLoading,
    threadDetail: threadDetail ?? null,
    send,
    stop,
    status,
    addToolOutput,
    addToolApprovalResponse,
  };
}
