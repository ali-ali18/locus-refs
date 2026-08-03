"use client";

import { type ChangeEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { useWorkspace } from "@/context/workspace";
import { useAiModels, useAiSettings } from "@/hook/ai/useAiSettings";
import type { AgentSkillId } from "@/lib/ai/skills";
import { api } from "@/lib/api";
import { deleteChatUploads } from "@/lib/chat-upload-cleanup";
import type { AgentSkill } from "@/types/agent-skill.type";
import {
  detectMentionQuery,
  type MentionQueryState,
} from "../ChatMentionDraft";
import {
  detectSkillQuery,
  type SkillQueryState,
} from "../ChatSkillPicker";
import { dataUrlToFile } from "../chatInputFiles";
import type { AgentMention, ChatAttachment } from "./useAiChat";

type SendFn = (
  text: string,
  options?: {
    skillId?: AgentSkillId;
    mentions?: AgentMention[];
    attachments?: ChatAttachment[];
  },
) => void;

export function useChatInputController({
  onSend,
  status,
}: {
  onSend: SendFn;
  status: "submitted" | "streaming" | "ready" | "error";
}) {
  const { workspaceId } = useWorkspace();
  const { data: models } = useAiModels();
  const { data: settings } = useAiSettings();

  const [mentions, setMentions] = useState<AgentMention[]>([]);
  const [mentionQuery, setMentionQuery] = useState<MentionQueryState | null>(
    null,
  );
  const [skillQuery, setSkillQuery] = useState<SkillQueryState | null>(null);
  const [draft, setDraft] = useState("");
  const [attachedSkill, setAttachedSkill] = useState<AgentSkill | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isStreaming = status === "submitted" || status === "streaming";
  const currentModel = models?.find((m) => m.id === settings?.defaultModelId);
  const modelSupportsVision =
    currentModel?.inputModalities?.includes("image") ?? false;

  const selectedIds = useMemo(
    () => new Set(mentions.map((m) => m.id)),
    [mentions],
  );

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setDraft(value);
    setMentions((prev) =>
      prev.filter((mention) => value.includes(`@${mention.title}`)),
    );
    setAttachedSkill((prev) =>
      prev && value.includes(`/${prev.title}`) ? prev : null,
    );
    const caret = event.target.selectionStart ?? value.length;
    const nextMention = detectMentionQuery(value, caret);
    const nextSkill = detectSkillQuery(value, caret);

    if (nextMention && nextSkill) {
      if (nextMention.start >= nextSkill.start) {
        setMentionQuery(nextMention);
        setSkillQuery(null);
      } else {
        setSkillQuery(nextSkill);
        setMentionQuery(null);
      }
      return;
    }

    setMentionQuery(nextMention);
    setSkillQuery(nextSkill);
  };

  const handleSelectMention = (mention: AgentMention) => {
    if (!mentionQuery) return;

    const before = draft.slice(0, mentionQuery.start);
    const after = draft.slice(
      mentionQuery.start + 1 + mentionQuery.query.length,
    );
    setDraft(`${before}@${mention.title} ${after}`);
    setMentions((prev) =>
      prev.some((m) => m.id === mention.id) ? prev : [...prev, mention],
    );
    setMentionQuery(null);
    setSkillQuery(null);
  };

  const handleSelectSkill = (skill: AgentSkill) => {
    const token = `/${skill.title}`;
    if (skillQuery) {
      const before = draft.slice(0, skillQuery.start);
      const after = draft.slice(
        skillQuery.start + 1 + skillQuery.query.length,
      );
      setDraft(`${before}${token} ${after}`);
    } else if (draft.includes(token)) {
      // já no texto
    } else {
      const sep = draft && !draft.endsWith(" ") && !draft.endsWith("\n") ? " " : "";
      setDraft(`${draft}${sep}${token} `);
    }
    setSkillQuery(null);
    setMentionQuery(null);
    setAttachedSkill(skill);
  };

  const handleClearSkill = () => {
    setAttachedSkill((prev) => {
      if (!prev) return null;
      const token = `/${prev.title}`;
      setDraft((d) =>
        d
          .replace(token, "")
          .replace(/ {2,}/g, " ")
          .trimStart(),
      );
      return null;
    });
  };

  const handleCloseSkillPicker = () => {
    setSkillQuery(null);
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    let trimmed = (message.text ?? draft).trim();
    const files = message.files ?? [];
    const hasSkill = !!attachedSkill;

    if (attachedSkill) {
      const token = `/${attachedSkill.title}`;
      trimmed = trimmed
        .replaceAll(token, "")
        .replace(/ {2,}/g, " ")
        .trim();
    }

    if (
      (!trimmed && files.length === 0 && !hasSkill) ||
      isStreaming ||
      isUploading
    ) {
      return;
    }

    const hasImages = files.some((f) =>
      (f.mediaType ?? "").startsWith("image/"),
    );
    if (hasImages && !modelSupportsVision) {
      toast.error(
        "Este modelo não lê imagens. Troque para Claude ou anexe um PDF.",
      );
      throw new Error("MODEL_NO_VISION");
    }

    setIsUploading(true);
    const uploaded: ChatAttachment[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const part = files[i];
        const file = await dataUrlToFile(part, i);
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await api.post<{
          data: {
            publicUrl: string;
            contentType: string;
            filename: string;
          };
        }>("/api/upload/chat", formData, {
          headers: { "x-workspace-id": workspaceId },
        });
        uploaded.push({
          url: data.data.publicUrl,
          mediaType: data.data.contentType,
          filename: data.data.filename,
        });
      }

      const activeMentions = mentions.filter((mention) =>
        trimmed.includes(`@${mention.title}`),
      );

      const text =
        trimmed ||
        (attachedSkill ? `/${attachedSkill.title}` : "") ||
        (uploaded.length ? "Analise o(s) arquivo(s) anexado(s)." : "");

      onSend(text, {
        skillId: attachedSkill?.id,
        mentions: activeMentions.length ? activeMentions : undefined,
        attachments: uploaded.length ? uploaded : undefined,
      });
      setMentions([]);
      setMentionQuery(null);
      setSkillQuery(null);
      setAttachedSkill(null);
      setDraft("");
    } catch (error) {
      if (uploaded.length > 0) {
        void deleteChatUploads(uploaded.map((u) => u.url));
      }
      if (error instanceof Error && error.message === "MODEL_NO_VISION") {
        throw error;
      }
      toast.error("Falha ao enviar anexo. Tente novamente.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    draft,
    mentions,
    mentionQuery,
    skillQuery,
    selectedIds,
    attachedSkill,
    isUploading,
    handleTextChange,
    handleSelectMention,
    handleSelectSkill,
    handleClearSkill,
    handleCloseSkillPicker,
    handleSubmit,
  };
}
