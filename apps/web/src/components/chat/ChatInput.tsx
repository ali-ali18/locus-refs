"use client";

import { Note01Icon } from "@hugeicons/core-free-icons";
import type { FileUIPart } from "ai";
import {
  CheckIcon,
  FileTextIcon,
  ImageIcon,
  PlusIcon,
  ReplyIcon,
  XIcon,
} from "lucide-react";
import {
  type ChangeEvent,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useChatPanel } from "@/context/chatPanel";
import { useWorkspace } from "@/context/workspace";
import {
  useAiModels,
  useAiSettings,
  useUpdateAiSettings,
} from "@/hook/ai/useAiSettings";
import { useNote } from "@/hook/notes/useNotes";
import type { AgentSkillId } from "@/lib/ai/skills";
import { api } from "@/lib/api";
import { deleteChatUploads } from "@/lib/chat-upload-cleanup";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { InputGroupText } from "../ui/input-group";
import { ChatMentionPicker } from "./ChatMentionPicker";
import type { AgentMention, ChatAttachment } from "./hook/useAiChat";

export interface ChatInputProps {
  onSend: (
    text: string,
    options?: {
      skillId?: AgentSkillId;
      mentions?: AgentMention[];
      attachments?: ChatAttachment[];
    },
  ) => void;
  onStop: () => void;
  status: "submitted" | "streaming" | "ready" | "error";
  noteId?: string;
  variant?: "dock" | "hero";
  placeholder?: string;
}

type ModelOption = NonNullable<ReturnType<typeof useAiModels>["data"]>[number];

const NOTE_TITLE_MAX_LENGTH = 20;
const SELECTION_PREVIEW_MAX = 80;
const CHAT_ACCEPT =
  "application/pdf,text/plain,image/jpeg,image/png,image/webp,image/gif,.pdf,.txt,.jpg,.jpeg,.png,.webp,.gif";

const PROVIDER_LABELS: Record<string, string> = {
  anthropic: "Anthropic",
  minimax: "MiniMax",
};

function providerLabel(provider: string): string {
  return PROVIDER_LABELS[provider] ?? provider;
}

function NoteChip({ noteId }: { noteId: string }) {
  const { data: note } = useNote(noteId);
  if (!note) return null;
  const title =
    note.title.length > NOTE_TITLE_MAX_LENGTH
      ? `${note.title.slice(0, NOTE_TITLE_MAX_LENGTH)}…`
      : note.title;
  return (
    <InputGroupText className="gap-1.5">
      <Icon icon={Note01Icon} className="size-3 shrink-0" />
      <span className="truncate text-xs">{title}</span>
    </InputGroupText>
  );
}

function ModelSelect() {
  const { data: models } = useAiModels();
  const { data: settings } = useAiSettings();
  const { mutate: updateSettings } = useUpdateAiSettings();
  const [open, setOpen] = useState(false);

  const currentModel = models?.find((m) => m.id === settings?.defaultModelId);
  const thinkingEnabled = settings?.thinkingEnabled ?? false;

  const grouped = useMemo(() => {
    const map = new Map<string, ModelOption[]>();
    for (const model of models ?? []) {
      const list = map.get(model.provider);
      if (list) {
        list.push(model);
      } else {
        map.set(model.provider, [model]);
      }
    }
    return Array.from(map);
  }, [models]);

  const handleSelect = useCallback(
    (id: string) => {
      updateSettings({ defaultModelId: id });
      setOpen(false);
    },
    [updateSettings],
  );

  return (
    <ModelSelector
      modal="trap-focus"
      onOpenChange={(nextOpen, details) => {
        if (!nextOpen) {
          const target = details.event?.target;
          if (
            target instanceof Element &&
            target.closest('[data-slot="hover-card-content"]')
          ) {
            return;
          }
        }
        setOpen(nextOpen);
      }}
      open={open}
    >
      <ModelSelectorTrigger
        render={<PromptInputButton className="gap-1.5 text-xs" size="sm" />}
      >
        {currentModel ? (
          <ModelSelectorLogo provider={currentModel.provider} />
        ) : null}
        <ModelSelectorName className="flex-none">
          {currentModel?.label ?? "Modelo"}
        </ModelSelectorName>
        {thinkingEnabled && currentModel?.supportsThinking ? (
          <span className="shrink-0 text-muted-foreground">Thinking</span>
        ) : null}
      </ModelSelectorTrigger>
      <ModelSelectorContent title="Selecionar modelo">
        <ModelSelectorInput placeholder="Buscar modelos..." />
        <ModelSelectorList>
          <ModelSelectorEmpty>Nenhum modelo encontrado.</ModelSelectorEmpty>
          {grouped.map(([provider, list]) => (
            <ModelSelectorGroup
              heading={providerLabel(provider)}
              key={provider}
            >
              {list.map((model) => {
                const isSelected = settings?.defaultModelId === model.id;
                const modelThinkingOn =
                  isSelected && thinkingEnabled && Boolean(model.supportsThinking);

                return (
                  <HoverCard key={model.id}>
                    <HoverCardTrigger
                      delay={150}
                      closeDelay={200}
                      render={
                        <ModelSelectorItem
                          onSelect={() => handleSelect(model.id)}
                          value={`${providerLabel(model.provider)} ${model.label} ${model.id}`}
                        />
                      }
                    >
                      <ModelSelectorLogo provider={model.provider} />
                      <ModelSelectorName>{model.label}</ModelSelectorName>
                      {isSelected ? (
                        <CheckIcon className="ml-auto size-4 shrink-0" />
                      ) : (
                        <div className="ml-auto size-4 shrink-0" />
                      )}
                    </HoverCardTrigger>
                    <HoverCardContent
                      side="right"
                      align="start"
                      sideOffset={10}
                      className="w-72 overflow-hidden rounded-xl p-0"
                    >
                      <div className="flex flex-col gap-1 px-3.5 py-3">
                        <p className="text-sm font-medium text-foreground">
                          {model.label}
                        </p>
                        {model.description ? (
                          <p className="text-xs text-muted-foreground">
                            {model.description}
                          </p>
                        ) : null}
                      </div>
                      {model.supportsThinking ? (
                        <>
                          <Separator />
                          <button
                            type="button"
                            className="flex w-full items-center justify-between gap-3 rounded-b-xl px-3.5 py-3 text-left outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
                            onClick={() => {
                              updateSettings({
                                defaultModelId: model.id,
                                thinkingEnabled: !modelThinkingOn,
                              });
                            }}
                          >
                            <span className="text-sm text-foreground">
                              Thinking
                            </span>
                            <Switch
                              checked={modelThinkingOn}
                              tabIndex={-1}
                              className="pointer-events-none"
                            />
                          </button>
                        </>
                      ) : null}
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </ModelSelectorGroup>
          ))}
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  );
}

const IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";
const FILE_ACCEPT = "application/pdf,.pdf,text/plain,.txt";
const ATTACH_MENU_GAP_PX = 20;

function AttachMenu({
  anchorRef,
  placement,
}: {
  anchorRef: RefObject<HTMLElement | null>;
  /** Sem mensagens: abaixo do input. Com mensagens: acima. */
  placement: "below" | "above";
}) {
  const attachments = usePromptInputAttachments();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);
  const [alignOffset, setAlignOffset] = useState(0);
  const [sideOffset, setSideOffset] = useState(ATTACH_MENU_GAP_PX);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;

    const update = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 0) setMenuWidth(width);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [anchorRef]);

  const syncPositionToInput = useCallback(() => {
    const input = anchorRef.current;
    const trigger = triggerRef.current;
    if (!input || !trigger) return;

    const inputRect = input.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();

    setAlignOffset(inputRect.left - triggerRect.left);

    // sideOffset é relativo ao trigger (+); compensamos até a borda do input + gap
    if (placement === "above") {
      setSideOffset(triggerRect.top - inputRect.top + ATTACH_MENU_GAP_PX);
    } else {
      setSideOffset(inputRect.bottom - triggerRect.bottom + ATTACH_MENU_GAP_PX);
    }
  }, [anchorRef, placement]);

  const handlePick = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.files?.length) {
        attachments.add(event.currentTarget.files);
      }
      event.currentTarget.value = "";
    },
    [attachments],
  );

  const side = placement === "below" ? "bottom" : "top";

  return (
    <>
      <input
        ref={imageInputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        multiple
        className="hidden"
        aria-hidden
        tabIndex={-1}
        onChange={handlePick}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept={FILE_ACCEPT}
        multiple
        className="hidden"
        aria-hidden
        tabIndex={-1}
        onChange={handlePick}
      />
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) syncPositionToInput();
        }}
      >
        <DropdownMenuTrigger
          ref={triggerRef}
          render={
            <PromptInputButton size="sm" aria-label="Adicionar anexo" />
          }
        >
          <PlusIcon className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={side}
          align="start"
          alignOffset={alignOffset}
          sideOffset={sideOffset}
          className="rounded-3xl border-border p-2 shadow-lg"
          style={
            menuWidth
              ? { width: menuWidth, minWidth: menuWidth, maxWidth: menuWidth }
              : undefined
          }
        >
          <DropdownMenuItem
            className="gap-3 rounded-2xl px-3 py-2.5"
            onClick={() => imageInputRef.current?.click()}
          >
            <ImageIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="flex min-w-0 items-center gap-2 text-sm">
              <span className="font-medium text-foreground">Anexar imagem</span>
              <span className="text-xs text-muted-foreground">
                Do computador
              </span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-3 rounded-2xl px-3 py-2.5"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="flex min-w-0 items-center gap-2 text-sm">
              <span className="font-medium text-foreground">
                Anexar arquivos
              </span>
              <span className="text-xs text-muted-foreground">PDF ou TXT</span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function PendingAttachments() {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;

  return (
    <Attachments variant="inline" className="w-full px-3.5 pt-2.5">
      {attachments.files.map((file) => (
        <Attachment
          key={file.id}
          data={file}
          onRemove={() => attachments.remove(file.id)}
        >
          <AttachmentPreview />
          <AttachmentInfo />
          <AttachmentRemove label="Remover anexo" />
        </Attachment>
      ))}
    </Attachments>
  );
}

interface MentionQueryState {
  start: number;
  query: string;
}

function detectMentionQuery(value: string, caret: number): MentionQueryState | null {
  const before = value.slice(0, caret);
  const match = before.match(/(^|[\s([{])@([^\s@]*)$/);
  if (!match) return null;
  const atIndex = before.lastIndexOf("@");
  return { start: atIndex, query: match[2] ?? "" };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedDraft({
  text,
  mentions,
}: {
  text: string;
  mentions: AgentMention[];
}) {
  const nodes = useMemo(() => {
    if (!text) return null;

    const titles = [...new Set(mentions.map((m) => m.title).filter(Boolean))].sort(
      (a, b) => b.length - a.length,
    );

    if (titles.length === 0) {
      return <span className="text-foreground">{text}</span>;
    }

    const pattern = new RegExp(
      `(@(?:${titles.map(escapeRegExp).join("|")}))`,
      "g",
    );
    const parts = text.split(pattern);

    return parts.map((part, index) => {
      const isMention = titles.some((title) => part === `@${title}`);
      return (
        <span
          key={`${index}-${part.slice(0, 12)}`}
          className={isMention ? "font-medium text-primary" : "text-foreground"}
        >
          {part}
        </span>
      );
    });
  }, [mentions, text]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words px-4 pt-3.5 pb-2 text-sm leading-normal"
    >
      {nodes}
      {text.endsWith("\n") ? <br /> : null}
    </div>
  );
}

async function dataUrlToFile(
  part: FileUIPart,
  index: number,
): Promise<File> {
  const res = await fetch(part.url);
  const blob = await res.blob();
  const name = part.filename || `attachment-${index}`;
  return new File([blob], name, {
    type: part.mediaType || blob.type || "application/octet-stream",
  });
}

export function ChatInput({
  onSend,
  onStop,
  status,
  noteId,
  variant = "dock",
  placeholder = "Pergunte alguma coisa… Digite @ para mencionar",
}: ChatInputProps) {
  const { attachedSelection, clearAttachedSelection } = useChatPanel();
  const { workspaceId } = useWorkspace();
  const { data: models } = useAiModels();
  const { data: settings } = useAiSettings();
  const isStreaming = status === "submitted" || status === "streaming";
  const [mentions, setMentions] = useState<AgentMention[]>([]);
  const [mentionQuery, setMentionQuery] = useState<MentionQueryState | null>(
    null,
  );
  const [draft, setDraft] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const inputAnchorRef = useRef<HTMLDivElement>(null);

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
    const caret = event.target.selectionStart ?? value.length;
    setMentionQuery(detectMentionQuery(value, caret));
  };

  const handleSelectMention = (mention: AgentMention) => {
    if (!mentionQuery) return;

    const before = draft.slice(0, mentionQuery.start);
    const after = draft.slice(
      mentionQuery.start + 1 + mentionQuery.query.length,
    );
    const next = `${before}@${mention.title} ${after}`;
    setDraft(next);
    setMentions((prev) =>
      prev.some((m) => m.id === mention.id) ? prev : [...prev, mention],
    );
    setMentionQuery(null);
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    const trimmed = (message.text ?? draft).trim();
    const files = message.files ?? [];
    if ((!trimmed && files.length === 0) || isStreaming || isUploading) return;

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
      onSend(trimmed || (uploaded.length ? "Analise o(s) arquivo(s) anexado(s)." : ""), {
        mentions: activeMentions.length ? activeMentions : undefined,
        attachments: uploaded.length ? uploaded : undefined,
      });
      setMentions([]);
      setMentionQuery(null);
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

  return (
    <div
      ref={inputAnchorRef}
      className={cn("relative w-full", variant === "dock" && "my-0")}
    >
      {mentionQuery ? (
        <ChatMentionPicker
          query={mentionQuery.query}
          selectedIds={selectedIds}
          onSelect={handleSelectMention}
        />
      ) : null}

      <PromptInput
        accept={CHAT_ACCEPT}
        multiple
        maxFiles={5}
        onError={(err) => toast.error(err.message)}
        onSubmit={handleSubmit}
        className={cn(
          "rounded-3xl border-border bg-card shadow-sm",
          variant === "hero" && "shadow-md",
        )}
      >
        {attachedSelection ? (
          <PromptInputHeader className="order-first w-full flex-col items-stretch gap-0 border-0 p-0 [.border-b]:pb-0">
            <div className="flex items-center gap-2.5 border-b border-border/50 px-3.5 py-2.5">
              <ReplyIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <p className="min-w-0 flex-1 truncate text-sm text-foreground">
                {attachedSelection.text.length > SELECTION_PREVIEW_MAX
                  ? `${attachedSelection.text.slice(0, SELECTION_PREVIEW_MAX)}…`
                  : attachedSelection.text}
              </p>
              <button
                type="button"
                aria-label="Remover trecho anexado"
                className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={clearAttachedSelection}
              >
                <XIcon className="size-3.5" />
              </button>
            </div>
          </PromptInputHeader>
        ) : null}

        <PendingAttachments />

        <div className="relative w-full">
          <HighlightedDraft text={draft} mentions={mentions} />
          <PromptInputTextarea
            className="relative z-10 max-h-32 min-h-14 bg-transparent px-4 pt-3.5 pb-2 text-transparent caret-foreground selection:bg-primary/20"
            placeholder={placeholder}
            onChange={handleTextChange}
            value={draft}
          />
        </div>
        <PromptInputFooter className="px-3 pb-3 pt-1">
          <PromptInputTools>
            <AttachMenu
              anchorRef={inputAnchorRef}
              placement={variant === "hero" ? "below" : "above"}
            />
            {noteId ? <NoteChip noteId={noteId} /> : null}
            <ModelSelect />
          </PromptInputTools>
          <PromptInputSubmit
            status={isUploading ? "submitted" : status}
            onStop={onStop}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
