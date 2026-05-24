"use client";

import type { HocuspocusProvider } from "@hocuspocus/provider";
import type { JSONContent } from "@tiptap/core";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { useCallback, useEffect, useState } from "react";
import {
  type PendingProposalTarget,
  useNoteEditor,
} from "@/context/noteEditor";
import { markdownToNoteContent } from "@/lib/ai/markdown-to-note-content";
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
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const openImageDialog = useCallback(() => setImageDialogOpen(true), []);

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

  useEffect(() => {
    if (!editor) return;

    return registerNoteEditor(noteId, {
      getSelectionContext,
      applyGeneratedText,
    });
  }, [applyGeneratedText, getSelectionContext, noteId, registerNoteEditor]);

  return (
    <EditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} />
      {editor && (
        <SlashCommand editor={editor} onOpenImageDialog={openImageDialog} />
      )}
      {editor && <EmojiDropdownMenu char=":" />}
      {editor && <DropdownNote editor={editor} />}
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
