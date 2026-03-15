"use client";

import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { SlashDropdownMenu } from "@/components/tiptap-ui/slash-dropdown-menu";
import {
  getNotesEditorExtensions,
  NOTES_EDITOR_PLACEHOLDER,
  NOTES_EDITOR_PROPS,
  NOTES_SLASH_MENU_CONFIG,
} from "@/lib/notes-editor-config";
import { EmojiDropdownMenu } from "../../tiptap-ui/emoji-dropdown-menu";
import { DropdownNote } from "./DropdownSelect/DropdownNote";

interface EditorProps {
  content?: string | null;
  onChange?: (content: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: getNotesEditorExtensions({
      placeholder: NOTES_EDITOR_PLACEHOLDER,
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
        <SlashDropdownMenu config={NOTES_SLASH_MENU_CONFIG} editor={editor} />
      )}
      {editor && <EmojiDropdownMenu char=":" />}
      {editor && <DropdownNote editor={editor} />}
    </EditorContext.Provider>
  );
}
