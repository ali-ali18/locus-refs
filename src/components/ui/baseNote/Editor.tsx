"use client";

import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { useMemo, useState } from "react";
import { SlashDropdownMenu } from "@/components/tiptap-ui/slash-dropdown-menu";
import {
  getNotesEditorExtensions,
  getNotesSlashMenuConfig,
  NOTES_EDITOR_PLACEHOLDER,
  NOTES_EDITOR_PROPS,
} from "@/lib/notes-editor-config";
import { EmojiDropdownMenu } from "../../tiptap-ui/emoji-dropdown-menu";
import { DropdownNote } from "./DropdownNote/DropdownNote";
import { ImageDialog } from "./imageBlock/ImageDialog";
import { useImageUpload } from "./imageBlock/useImageUpload";

interface EditorProps {
  content?: string | null;
  onChange?: (content: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
  const { uploadImage } = useImageUpload();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const slashMenuConfig = useMemo(
    () => getNotesSlashMenuConfig(() => setImageDialogOpen(true)),
    [],
  );

  const editor = useEditor({
    extensions: getNotesEditorExtensions({
      placeholder: NOTES_EDITOR_PLACEHOLDER,
      uploadImage,
    }),
    content: content,
    immediatelyRender: false,
    editorProps: NOTES_EDITOR_PROPS,
    onUpdate({ editor }) {
      if (!onChange) return;
      onChange(editor.getHTML());
    },
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} />
      {editor && (
        <SlashDropdownMenu config={slashMenuConfig} editor={editor} />
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
