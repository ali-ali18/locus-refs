"use client";

import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { SlashDropdownMenu } from "@/components/tiptap-ui/slash-dropdown-menu";
import {
  getNotesEditorExtensions,
  NOTES_EDITOR_PLACEHOLDER,
  NOTES_EDITOR_PROPS,
  NOTES_SLASH_MENU_CONFIG,
} from "@/lib/notes-editor-config";
import { EmojiDropdownMenu } from "../tiptap-ui/emoji-dropdown-menu";

export function Editor({ content }: { content?: string }) {
  const editor = useEditor({
    extensions: getNotesEditorExtensions({
      placeholder: NOTES_EDITOR_PLACEHOLDER,
    }),
    content,
    immediatelyRender: false,
    editorProps: NOTES_EDITOR_PROPS,
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.focus();
    }
  }, [editor]);

  return (
    <EditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} />
      {editor && (
        <SlashDropdownMenu config={NOTES_SLASH_MENU_CONFIG} editor={editor} />
      )}
      {editor && <EmojiDropdownMenu char=":" />}
    </EditorContext.Provider>
  );
}
