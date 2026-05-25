"use client";

import type { HocuspocusProvider } from "@hocuspocus/provider";
import type { JSONContent } from "@tiptap/core";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChatPanel } from "@/context/chatPanel";
import {
  type EnumeratedBlock,
  type PendingProposalTarget,
  useNoteEditor,
} from "@/context/noteEditor";
import { markdownToNoteContent } from "@/lib/ai/markdown-to-note-content";
import type { NoteEditToolInput, NoteEditToolResult } from "@/lib/ai/tools";
import {
  type CollabUser,
  getNotesEditorExtensions,
  NOTES_EDITOR_PLACEHOLDER,
  NOTES_EDITOR_PROPS,
} from "@/lib/notes-editor-config";
import { EmojiDropdownMenu } from "../../tiptap-ui/emoji-dropdown-menu";
import { DropdownNote } from "./DropdownNote/DropdownNote";
import { ImageDialog } from "./imageBlock/ImageDialog";
import { useImageUpload } from "./imageBlock/useImageUpload";
import { SlashCommand } from "./SlashCommand/SlashCommand";

interface EditorProps {
  noteId: string;
  content?: JSONContent | null;
  onChange?: (content: JSONContent) => void;
  provider?: HocuspocusProvider;
  user?: CollabUser;
}

export function Editor({
  noteId,
  content,
  onChange,
  provider,
  user,
}: EditorProps) {
  const { uploadImage } = useImageUpload();
  const { registerNoteEditor } = useNoteEditor();
  const { attachedSelection, clearAttachedSelection } = useChatPanel();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const openImageDialog = useCallback(() => setImageDialogOpen(true), []);

  const attachedSelectionRef = useRef(attachedSelection);
  attachedSelectionRef.current = attachedSelection;

  const editor = useEditor({
    extensions: getNotesEditorExtensions({
      placeholder: NOTES_EDITOR_PLACEHOLDER,
      uploadImage,
      ydoc: provider?.document,
      provider,
      user,
    }),
    content: provider ? undefined : content,
    immediatelyRender: false,
    editorProps: NOTES_EDITOR_PROPS,
    onUpdate({ editor }) {
      if (!onChange) return;
      onChange(editor.getJSON());
    },
  });

  const markdownToDoc = useCallback((text: string): JSONContent | null => {
    const blocks = markdownToNoteContent(text);
    if (blocks.length === 0) return null;

    return {
      type: "doc",
      content: blocks,
    };
  }, []);

  const getSelectionContext = useCallback(() => {
    if (!editor) {
      return { hasSelection: false, from: null, to: null, text: "" };
    }

    const { from, to, empty } = editor.state.selection;
    const text = empty
      ? ""
      : editor.state.doc.textBetween(from, to, "\n").trim();

    return {
      hasSelection: !empty && text.length > 0,
      from,
      to,
      text,
    };
  }, [editor]);

  const applyGeneratedText = useCallback(
    (text: string, target: PendingProposalTarget) => {
      if (!editor) return false;

      const doc = markdownToDoc(text);
      if (!doc?.content?.length) return false;

      try {
        if (
          target.type === "selection" &&
          typeof target.from === "number" &&
          typeof target.to === "number"
        ) {
          editor
            .chain()
            .focus()
            .insertContentAt({ from: target.from, to: target.to }, doc.content)
            .run();
          return true;
        }

        const end = editor.state.doc.content.size;
        editor.chain().focus().insertContentAt(end, doc.content).run();
        return true;
      } catch {
        return false;
      }
    },
    [editor, markdownToDoc],
  );

  useEffect(() => {
    if (!provider || !editor || !content) return;
    const handler = ({ state }: { state: boolean }) => {
      if (state && editor.isEmpty) {
        editor.commands.setContent(content);
      }
    };
    provider.on("synced", handler);
    return () => {
      provider.off("synced", handler);
    };
  }, [provider, editor, content]);

  const getBlockRanges = useCallback(() => {
    if (!editor) return [];
    const ranges: Array<{ start: number; end: number; nodeSize: number }> = [];
    let pos = 1;
    editor.state.doc.content.forEach((node) => {
      ranges.push({
        start: pos,
        end: pos + node.nodeSize,
        nodeSize: node.nodeSize,
      });
      pos += node.nodeSize;
    });
    return ranges;
  }, [editor]);

  const getEnumeratedBlocks = useCallback((): EnumeratedBlock[] => {
    if (!editor) return [];
    const blocks: EnumeratedBlock[] = [];
    editor.state.doc.content.forEach((node, _offset, index) => {
      const preview = node.textContent
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 120);
      blocks.push({ index, type: node.type.name, preview });
    });
    return blocks;
  }, [editor]);

  const applyToolOperation = useCallback(
    (op: NoteEditToolInput): NoteEditToolResult => {
      if (!editor)
        return { status: "error", reason: "Editor não inicializado." };

      const doc = markdownToDoc(op.input.content);
      if (!doc?.content?.length) {
        return {
          status: "error",
          reason: "Conteúdo Markdown inválido ou vazio.",
        };
      }

      try {
        if (op.name === "appendToEnd") {
          const end = editor.state.doc.content.size;
          editor.chain().focus().insertContentAt(end, doc.content).run();
          return { status: "applied" };
        }

        if (op.name === "replaceEntireNote") {
          editor
            .chain()
            .focus()
            .setContent({ type: "doc", content: doc.content })
            .run();
          return { status: "applied" };
        }

        if (op.name === "replaceSelection") {
          const chip = attachedSelectionRef.current;
          const useChip = !!(chip && chip.noteId === noteId);

          let from: number;
          let to: number;

          if (useChip && chip) {
            from = chip.from;
            to = chip.to;
            const docSize = editor.state.doc.content.size;
            if (to > docSize) {
              return {
                status: "error",
                reason:
                  "Trecho original mudou ou foi removido. Refaça a seleção.",
              };
            }
            const currentText = editor.state.doc
              .textBetween(from, to, "\n")
              .trim();
            if (currentText !== chip.text.trim()) {
              return {
                status: "error",
                reason: "Trecho alterado desde a anexação. Descarte e refaça.",
              };
            }
          } else {
            const sel = editor.state.selection;
            if (sel.empty) {
              return {
                status: "error",
                reason: "Sem seleção ativa para substituir.",
              };
            }
            from = sel.from;
            to = sel.to;
          }

          editor
            .chain()
            .focus()
            .insertContentAt({ from, to }, doc.content)
            .run();
          if (useChip) clearAttachedSelection();
          return { status: "applied" };
        }

        const ranges = getBlockRanges();
        const target = ranges[op.input.blockIndex];
        if (!target) {
          return {
            status: "error",
            reason: `Bloco ${op.input.blockIndex} não existe (a nota tem ${ranges.length} blocos).`,
          };
        }

        if (op.name === "insertAfterBlock") {
          editor.chain().focus().insertContentAt(target.end, doc.content).run();
          return { status: "applied" };
        }
        if (op.name === "insertBeforeBlock") {
          editor
            .chain()
            .focus()
            .insertContentAt(target.start, doc.content)
            .run();
          return { status: "applied" };
        }
        if (op.name === "replaceBlock") {
          editor
            .chain()
            .focus()
            .insertContentAt(
              { from: target.start, to: target.end },
              doc.content,
            )
            .run();
          return { status: "applied" };
        }

        return { status: "error", reason: "Operação desconhecida." };
      } catch (error) {
        return {
          status: "error",
          reason: error instanceof Error ? error.message : "Falha ao aplicar.",
        };
      }
    },
    [editor, getBlockRanges, markdownToDoc, noteId, clearAttachedSelection],
  );

  useEffect(() => {
    if (!editor) return;

    return registerNoteEditor(noteId, {
      getSelectionContext,
      applyGeneratedText,
      getEnumeratedBlocks,
      applyToolOperation,
    });
  }, [
    applyGeneratedText,
    applyToolOperation,
    getEnumeratedBlocks,
    getSelectionContext,
    noteId,
    registerNoteEditor,
  ]);

  return (
    <EditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} />
      {editor && (
        <SlashCommand editor={editor} onOpenImageDialog={openImageDialog} />
      )}
      {editor && <EmojiDropdownMenu char=":" />}
      {editor && <DropdownNote editor={editor} noteId={noteId} />}
      {editor && (
        <ImageDialog
          editor={editor}
          open={imageDialogOpen}
          onOpenChange={setImageDialogOpen}
          uploadImage={uploadImage}
        />
      )}
    </EditorContext.Provider>
  );
}
