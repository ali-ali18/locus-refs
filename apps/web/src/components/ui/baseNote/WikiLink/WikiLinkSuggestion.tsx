"use client";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react";
import { PluginKey } from "@tiptap/pm/state";
import type { Editor } from "@tiptap/react";
import { Suggestion } from "@tiptap/suggestion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNotes } from "@/hook/notes/useNotes";
import type { WikiLinkItem } from "./types";
import { DEFAULT_NOTE_LINK_BACKGROUND } from "./noteLinkStyle";
import { WikiLinkList } from "./WikiLinkList";

const PLUGIN_KEY = new PluginKey("wikiLinkSuggestion");

interface Props {
  editor: Editor;
  noteId: string;
}

function filterNotes(
  notes: WikiLinkItem[],
  query: string,
  currentNoteId: string,
): WikiLinkItem[] {
  const normalized = query.trim().toLowerCase();
  return notes
    .filter((note) => note.id !== currentNoteId)
    .filter((note) => {
      if (!normalized) return true;
      return (note.title || "Sem título").toLowerCase().includes(normalized);
    })
    .slice(0, 20);
}

export function WikiLinkSuggestion({ editor, noteId }: Props) {
  const { data: notes = [] } = useNotes();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<WikiLinkItem[]>([]);
  const [decorationNode, setDecorationNode] = useState<HTMLElement | null>(
    null,
  );
  const [commandFn, setCommandFn] = useState<
    ((item: WikiLinkItem) => void) | null
  >(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const stateRef = useRef({ items, selectedIndex });
  stateRef.current = { items, selectedIndex };

  const noteItems = useMemo<WikiLinkItem[]>(
    () =>
      notes.map((note) => ({
        id: note.id,
        title: note.title,
        icon: note.icon,
      })),
    [notes],
  );

  const notesRef = useRef(noteItems);
  notesRef.current = noteItems;

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(8),
      flip({ mainAxis: true, crossAxis: false }),
      shift(),
      size({
        apply({ availableHeight, elements }) {
          elements.floating?.style.setProperty(
            "--wiki-link-max-h",
            `${Math.min(320, availableHeight)}px`,
          );
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    refs.setReference(decorationNode);
  }, [decorationNode, refs]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setItems([]);
    setSelectedIndex(0);
    setDecorationNode(null);
    setCommandFn(null);
  }, []);

  const selectItem = useCallback(
    (item: WikiLinkItem) => {
      closeMenu();
      commandFn?.(item);
    },
    [closeMenu, commandFn],
  );

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    if (editor.state.plugins.some((plugin) => plugin.spec.key === PLUGIN_KEY)) {
      editor.unregisterPlugin(PLUGIN_KEY);
    }

    const plugin = Suggestion<WikiLinkItem>({
      pluginKey: PLUGIN_KEY,
      editor,
      char: "[[",
      allowSpaces: true,
      items: ({ query }) => filterNotes(notesRef.current, query, noteId),
      allow({ range }) {
        const $from = editor.state.doc.resolve(range.from);
        for (let depth = $from.depth; depth > 0; depth--) {
          const name = $from.node(depth).type.name;
          if (
            name === "codeBlock" ||
            name === "codeBlockCustom" ||
            name === "image"
          ) {
            return false;
          }
        }
        return true;
      },
      command({ editor: currentEditor, range, props: item }) {
        currentEditor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "noteLink",
            attrs: {
              id: item.id,
              title: item.title || "Sem título",
              icon: item.icon,
              color: null,
              backgroundColor: DEFAULT_NOTE_LINK_BACKGROUND,
            },
          })
          .insertContent(" ")
          .run();
      },
      render: () => ({
        onStart(props) {
          setItems(props.items);
          setDecorationNode((props.decorationNode as HTMLElement) ?? null);
          setCommandFn(() => props.command);
          setSelectedIndex(0);
          setOpen(true);
        },
        onUpdate(props) {
          setItems(props.items);
          setDecorationNode((props.decorationNode as HTMLElement) ?? null);
          setCommandFn(() => props.command);
          setSelectedIndex(0);
        },
        onKeyDown({ event }) {
          if (event.key === "Escape") {
            closeMenu();
            return true;
          }
          return false;
        },
        onExit: closeMenu,
      }),
    });

    editor.registerPlugin(plugin);
    return () => {
      if (!editor.isDestroyed) editor.unregisterPlugin(PLUGIN_KEY);
    };
  }, [editor, noteId, closeMenu]);

  useEffect(() => {
    if (!open) return;
    const dom = editor?.view?.dom;
    if (!dom) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { items: currentItems, selectedIndex: currentIndex } =
        stateRef.current;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((currentIndex + 1) % Math.max(1, currentItems.length));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex(
          (currentIndex - 1 + currentItems.length) %
            Math.max(1, currentItems.length),
        );
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const item = currentItems[currentIndex];
        if (item) {
          closeMenu();
          commandFn?.(item);
        }
      }
    };

    dom.addEventListener("keydown", handleKeyDown, true);
    return () => dom.removeEventListener("keydown", handleKeyDown, true);
  }, [open, editor, closeMenu, commandFn]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={refs.setFloating}
      style={{ ...floatingStyles, zIndex: 1000 }}
      onPointerDown={(event) => event.preventDefault()}
    >
      <WikiLinkList
        items={items}
        selectedIndex={selectedIndex}
        onSelect={selectItem}
      />
    </div>,
    document.body,
  );
}
