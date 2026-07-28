"use client";

import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { useImageResize } from "@/components/ui/baseNote/imageBlock/useImageResize";
import { youtubeProvider } from "@/lib/embed/providers/youtube";
import type { EmbedProviderId } from "@/lib/embed/types";

export function PluginBlockView({ node, updateAttributes }: NodeViewProps) {
  const {
    url,
    provider,
    providerId,
    width: initialWidth,
  } = node.attrs as {
    url: string;
    provider: EmbedProviderId;
    providerId: string;
    width?: number;
  };

  const { width, containerRef, onMouseDown } = useImageResize({
    initialWidth: initialWidth ?? 60,
    onResizeEnd: (w) => updateAttributes({ width: w }),
  });

  if (provider === "youtube" && providerId) {
    return (
      <NodeViewWrapper
        as="div"
        contentEditable={false}
        className="my-4 flex justify-start"
      >
        <div
          ref={containerRef}
          className="group relative"
          style={{ width: `${width}%` }}
        >
          <button
            type="button"
            onMouseDown={(e) => onMouseDown(e, "left")}
            className="absolute left-0 top-0 z-10 flex h-full w-3 -translate-x-1/2 cursor-ew-resize items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <div className="h-8 w-1 rounded-full bg-foreground/40" />
          </button>

          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc={youtubeProvider.getVideoSrc(providerId)}
            thumbnailSrc={youtubeProvider.getThumbnail(providerId)}
            thumbnailAlt="YouTube"
          />

          <button
            type="button"
            onMouseDown={(e) => onMouseDown(e, "right")}
            className="absolute right-0 top-0 z-10 flex h-full w-3 translate-x-1/2 cursor-ew-resize items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <div className="h-8 w-1 rounded-full bg-foreground/40" />
          </button>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper contentEditable={false} className="my-4 w-full">
      <a
        href={url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted-foreground underline"
      >
        {url || "Plugin sem URL"}
      </a>
    </NodeViewWrapper>
  );
}
