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
import { SlashCommandList } from "./SlashCommandList";
import {
  buildSlashCommands,
  filterSlashCommands,
  type SlashCommandItem,
} from "./slashCommands";

const PLUGIN_KEY = new PluginKey("slashCommand");

interface Props {
  editor: Editor;
  onOpenImageDialog: () => void;
  onOpenPluginDialog: () => void;
}

export function SlashCommand({
  editor,
  onOpenImageDialog,
  onOpenPluginDialog,
}: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SlashCommandItem[]>([]);
  const [decorationNode, setDecorationNode] = useState<HTMLElement | null>(
    null,
  );
  const [commandFn, setCommandFn] = useState<
    ((item: SlashCommandItem) => void) | null
  >(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Stable ref for values the keydown handler needs — avoids re-registering listener
  const stateRef = useRef({ items, selectedIndex });
  stateRef.current = { items, selectedIndex };

  const commands = useMemo(
    () => buildSlashCommands(onOpenImageDialog, onOpenPluginDialog),
    [onOpenImageDialog, onOpenPluginDialog],
  );

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(8),
      flip({ mainAxis: true, crossAxis: false }),
      shift(),
      size({
        apply({ availableHeight, elements }) {
          elements.floating?.style.setProperty(
            "--slash-max-h",
            `${Math.min(384, availableHeight)}px`,
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
    (item: SlashCommandItem) => {
      closeMenu();
      commandFn?.(item);
    },
    [closeMenu, commandFn],
  );

  // Register Tiptap Suggestion plugin
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    // Unregister if already present (e.g. StrictMode double-mount)
    if (editor.state.plugins.some((p) => p.spec.key === PLUGIN_KEY)) {
      editor.unregisterPlugin(PLUGIN_KEY);
    }

    const plugin = Suggestion<SlashCommandItem>({
      pluginKey: PLUGIN_KEY,
      editor,
      char: "/",
      items: ({ query }) => filterSlashCommands(commands, query),

      allow({ range }) {
        const $from = editor.state.doc.resolve(range.from);
        for (let depth = $from.depth; depth > 0; depth--) {
          if ($from.node(depth).type.name === "image") return false;
        }
        return true;
      },

      command({ editor: e, range, props: item }) {
        e.chain().focus().deleteRange(range).run();
        item.onSelect({ editor: e, range });
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
  }, [editor, commands, closeMenu]);

  // Keyboard navigation — listener on editor DOM so editor keeps focus
  useEffect(() => {
    if (!open) return;
    const dom = editor?.view?.dom;
    if (!dom) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const { items: currentItems, selectedIndex: currentIndex } =
        stateRef.current;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((currentIndex + 1) % Math.max(1, currentItems.length));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (currentIndex - 1 + currentItems.length) %
            Math.max(1, currentItems.length),
        );
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
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
      onPointerDown={(e) => e.preventDefault()}
    >
      <SlashCommandList
        items={items}
        selectedIndex={selectedIndex}
        onSelect={selectItem}
      />
    </div>,
    document.body,
  );
}
