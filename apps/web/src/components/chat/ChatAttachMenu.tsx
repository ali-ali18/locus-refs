"use client";

import { FileTextIcon, ImageIcon, PlusIcon } from "lucide-react";
import {
  type ChangeEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  PromptInputButton,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hook/use-mobile";

const IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";
const FILE_ACCEPT = "application/pdf,.pdf,text/plain,.txt";
const ATTACH_MENU_GAP_PX = 20;

export function ChatAttachMenu({
  anchorRef,
  placement,
}: {
  anchorRef: RefObject<HTMLElement | null>;
  /** Sem mensagens: abaixo do input. Com mensagens: acima. */
  placement: "below" | "above";
}) {
  const isMobile = useIsMobile();
  const attachments = usePromptInputAttachments();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);
  const [alignOffset, setAlignOffset] = useState(0);
  const [sideOffset, setSideOffset] = useState(ATTACH_MENU_GAP_PX);

  useEffect(() => {
    if (isMobile) return;
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
  }, [anchorRef, isMobile]);

  const syncPositionToInput = useCallback(() => {
    if (isMobile) return;
    const input = anchorRef.current;
    const trigger = triggerRef.current;
    if (!input || !trigger) return;

    const inputRect = input.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();

    setAlignOffset(inputRect.left - triggerRect.left);

    if (placement === "above") {
      setSideOffset(triggerRect.top - inputRect.top + ATTACH_MENU_GAP_PX);
    } else {
      setSideOffset(inputRect.bottom - triggerRect.bottom + ATTACH_MENU_GAP_PX);
    }
  }, [anchorRef, isMobile, placement]);

  const handlePick = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.files?.length) {
        attachments.add(event.currentTarget.files);
      }
      event.currentTarget.value = "";
    },
    [attachments],
  );

  const side = isMobile
    ? "top"
    : placement === "below"
      ? "bottom"
      : "top";

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
          alignOffset={isMobile ? 0 : alignOffset}
          sideOffset={isMobile ? 8 : sideOffset}
          className="min-w-56 rounded-3xl border-border p-2 shadow-lg"
          style={
            !isMobile && menuWidth
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

export function ChatPendingAttachments() {
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
