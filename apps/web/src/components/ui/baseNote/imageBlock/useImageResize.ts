"use client";

import { useRef, useState } from "react";

interface UseImageResizeOptions {
  initialWidth: number;
  onResizeEnd: (width: number) => void;
}

export function useImageResize({ initialWidth, onResizeEnd }: UseImageResizeOptions) {
  const [width, setWidth] = useState<number>(initialWidth ?? 100);
  const containerRef = useRef<HTMLDivElement>(null);

  function onMouseDown(e: React.MouseEvent, side: "left" | "right") {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;
    const editorWidth = containerRef.current?.parentElement?.offsetWidth ?? 1;

    let currentWidth = startWidth;

    function onMouseMove(ev: MouseEvent) {
      const delta = ev.clientX - startX;
      const direction = side === "right" ? 1 : -1;
      currentWidth = Math.round(
        Math.min(100, Math.max(10, startWidth + (delta / editorWidth) * 100 * direction)),
      );
      setWidth(currentWidth);
    }

    function onMouseUp() {
      onResizeEnd(currentWidth);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  return { width, containerRef, onMouseDown };
}
