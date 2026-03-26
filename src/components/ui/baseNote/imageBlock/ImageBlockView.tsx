/** biome-ignore-all lint/performance/noImgElement: Image is rendered with srcset and lazy loading, not a performance issue */
"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { ImageZoom } from "@/components/kibo-ui/image-zoom";
import { useImageResize } from "./useImageResize";

export function ImageBlockView({ node, updateAttributes }: NodeViewProps) {
  const { src, alt, title, width: initialWidth } = node.attrs as {
    src: string;
    alt?: string;
    title?: string;
    width: number;
  };

  const { width, containerRef, onMouseDown } = useImageResize({
    initialWidth,
    onResizeEnd: (w) => updateAttributes({ width: w }),
  });

  return (
    <NodeViewWrapper as="div" className="my-4 flex justify-start">
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

        <ImageZoom
          zoomMargin={45}
        >
          <img
            src={src}
            alt={alt ?? ""}
            title={title ?? undefined}
            style={{ width: "100%", height: "auto", display: "block" }}
            className="rounded-xl"
            draggable={false}
          />
        </ImageZoom>

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
