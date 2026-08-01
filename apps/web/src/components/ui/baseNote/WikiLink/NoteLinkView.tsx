"use client";

import { Note01FreeIcons } from "@hugeicons/core-free-icons";
import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { useNoteTrail } from "@/context/noteTrail";
import { useWorkspace } from "@/context/workspace";
import { useNote } from "@/hook/notes/useNotes";
import { resolveIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { noteLinkStyleToCss } from "./noteLinkStyle";

function parseNoteId(pathname: string): string | null {
  const match = pathname.match(/\/notes\/([^/]+)\/?$/);
  return match?.[1] ?? null;
}

const noteLinkBaseClassName = cn(
  "!inline-flex !items-center gap-1.5 align-baseline",
  "mx-0.5 max-w-[14rem] rounded-none px-1.5 py-0.5",
  "text-[1em] leading-none font-medium tracking-tight",
  "transition-[box-shadow,opacity] hover:opacity-90",
);

export function NoteLinkView({
  node,
  editor,
  getPos,
  selected,
}: NodeViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { workspaceSlug } = useWorkspace();
  const { navigateViaLink } = useNoteTrail();
  const currentNoteId = parseNoteId(pathname);
  const { data: currentNote } = useNote(currentNoteId ?? "");

  const id = node.attrs.id as string | null;
  const title = (node.attrs.title as string) || "Nota";
  const iconName = node.attrs.icon as string | null;
  const markStyle = noteLinkStyleToCss({
    color: node.attrs.color,
    backgroundColor: node.attrs.backgroundColor,
    bold: Boolean(node.attrs.bold),
    italic: Boolean(node.attrs.italic),
    underline: Boolean(node.attrs.underline),
    strike: Boolean(node.attrs.strike),
  });

  function selectNode() {
    const pos = getPos();
    if (typeof pos !== "number") return;
    editor.chain().setNodeSelection(pos).run();
  }

  function navigateToNote() {
    if (!id) return;

    if (currentNoteId && currentNote) {
      navigateViaLink(
        {
          id: currentNoteId,
          title: currentNote.title || "Sem título",
          icon: currentNote.icon,
        },
        {
          id,
          title,
          icon: iconName,
        },
      );
    }

    router.push(`/${workspaceSlug}/notes/${id}`);
  }

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.metaKey || event.ctrlKey) {
      navigateToNote();
      return;
    }

    selectNode();
  }

  function handleDoubleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    navigateToNote();
  }

  if (!id) {
    return (
      <NodeViewWrapper
        as="span"
        className={noteLinkBaseClassName}
        style={markStyle}
      >
        {title}
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      as="span"
      className={cn(
        noteLinkBaseClassName,
        "cursor-pointer select-none",
        selected && "outline outline-2 outline-ring outline-offset-2",
      )}
      data-selected={selected ? "true" : undefined}
      style={markStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      contentEditable={false}
      title="Clique para selecionar · Ctrl/Cmd+clique ou duplo clique para abrir"
    >
      <Icon
        icon={iconName ? resolveIcon(iconName) : Note01FreeIcons}
        className="size-3.5 shrink-0 opacity-70"
      />
      <span className="min-w-0 truncate">{title}</span>
    </NodeViewWrapper>
  );
}
