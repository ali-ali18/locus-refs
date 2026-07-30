"use client";

import { ReplyIcon } from "lucide-react";
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  Attachments,
  getAttachmentLabel,
} from "@/components/ai-elements/attachments";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import type { ChatFilePart } from "./chatMessageParts";

function AttachedSelectionQuote({ text }: { text: string }) {
  const preview =
    text.length > 280 ? `${text.slice(0, 280).trimEnd()}…` : text;

  return (
    <div className="mb-1.5 flex max-w-[85%] items-start gap-2 self-end rounded-2xl border border-border/60 bg-muted/50 px-3 py-2 text-left">
      <ReplyIcon
        className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
        aria-hidden
      />
      <p className="min-w-0 flex-1 text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground wrap-anywhere">
        {preview}
      </p>
    </div>
  );
}

function UserFileAttachments({ files }: { files: ChatFilePart[] }) {
  if (files.length === 0) return null;

  return (
    <Attachments
      variant="inline"
      className="mb-1.5 ml-auto max-w-[85%] justify-end"
    >
      {files.map((file, idx) => {
        const data = {
          id: `${file.url}-${idx}`,
          type: "file" as const,
          url: file.url,
          mediaType: file.mediaType,
          filename: file.filename,
        };
        return (
          <Attachment key={data.id} data={data}>
            <AttachmentPreview />
            <AttachmentInfo />
            <span className="sr-only">{getAttachmentLabel(data)}</span>
          </Attachment>
        );
      })}
    </Attachments>
  );
}

export function ChatUserMessage({
  text,
  attachedQuote,
  files,
}: {
  text: string;
  attachedQuote?: string;
  files: ChatFilePart[];
}) {
  if (!text && !attachedQuote && files.length === 0) return null;

  return (
    <div className="flex w-full flex-col items-end gap-1.5">
      {attachedQuote ? <AttachedSelectionQuote text={attachedQuote} /> : null}
      <UserFileAttachments files={files} />
      {text ? (
        <Bubble variant="default" align="end" className="max-w-[85%] min-w-0">
          <BubbleContent className="rounded-2xl whitespace-pre-wrap wrap-anywhere">
            {text}
          </BubbleContent>
        </Bubble>
      ) : null}
    </div>
  );
}
