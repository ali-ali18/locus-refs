"use client";

import type { HocuspocusProvider } from "@hocuspocus/provider";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { useCallback, useEffect, useState } from "react";
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
  content?: string | null;
  onChange?: (content: string) => void;
  provider?: HocuspocusProvider;
  user?: CollabUser;
}

export function Editor({ content, onChange, provider, user }: EditorProps) {
  const { uploadImage } = useImageUpload();
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
      onChange(editor.getHTML());
    },
  });

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
