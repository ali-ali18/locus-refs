"use client";

import {
  BubbleChatAddIcon,
  ClipboardIcon,
  Copy01Icon,
  Eraser01Icon,
  Link01Icon,
  LinkSquare02Icon,
  Message01Icon,
  ScissorIcon,
} from "@hugeicons/core-free-icons";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditorState } from "@tiptap/react";
import { toast } from "sonner";
import { Icon } from "@/components/shared/Icon";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useChatPanel } from "@/context/chatPanel";
import { copyToClipboard } from "@/lib/clipboard";
import { copySelectionForMessaging } from "@/lib/copy-selection-messaging";

interface Props {
  editor: Editor;
  noteId?: string;
}

function getSelectedPlainText(editor: Editor): string {
  const { from, to, empty } = editor.state.selection;
  if (empty) return "";
  return editor.state.doc.textBetween(from, to, "\n");
}

export function NoteEditorSurface({ editor, noteId }: Props) {
  const { attachSelection } = useChatPanel();

  const menuState = useEditorState({
    editor,
    selector: ({ editor: current }) => {
      const { from, to, empty } = current.state.selection;
      const selectedText = empty
        ? ""
        : current.state.doc.textBetween(from, to, "\n").trim();
      const href = current.isActive("link")
        ? (current.getAttributes("link").href as string | undefined)
        : undefined;

      return {
        hasSelection: selectedText.length > 0,
        linkHref: href?.trim() ? href : null,
      };
    },
  });

  const handleCopy = async () => {
    const text = getSelectedPlainText(editor);
    if (!text.trim()) return;
    try {
      await copyToClipboard(text);
      toast.success("Texto copiado");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const handleCut = async () => {
    const text = getSelectedPlainText(editor);
    if (!text.trim()) return;
    try {
      await copyToClipboard(text);
      editor.chain().focus().deleteSelection().run();
      toast.success("Texto recortado");
    } catch {
      toast.error("Não foi possível recortar.");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        toast.message("Área de transferência vazia");
        return;
      }
      editor.chain().focus().insertContent(text).run();
    } catch {
      toast.error(
        "Não foi possível colar. Verifique a permissão do clipboard.",
      );
    }
  };

  const handleAddToChat = () => {
    if (!noteId) return;
    const { from, to, empty } = editor.state.selection;
    if (empty) return;
    const text = editor.state.doc.textBetween(from, to, "\n").trim();
    if (!text) return;
    attachSelection({ noteId, from, to, text });
    toast.success("Seleção adicionada ao chat");
  };

  const handleCopyLink = async () => {
    const href = menuState.linkHref;
    if (!href) return;
    try {
      await copyToClipboard(href);
      toast.success("Link copiado");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };

  const handleOpenLink = () => {
    const href = menuState.linkHref;
    if (!href) return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const handleClearFormatting = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
    toast.success("Formatação removida");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="block w-full select-text">
        <EditorContent editor={editor} />
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-52 rounded-xl">
        <ContextMenuGroup>
          <ContextMenuLabel>Clipboard</ContextMenuLabel>
          <ContextMenuItem
            className="rounded-xl"
            disabled={!menuState.hasSelection}
            onClick={() => {
              void handleCopy();
            }}
          >
            <Icon icon={Copy01Icon} />
            Copiar
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            className="rounded-xl"
            disabled={!menuState.hasSelection}
            onClick={() => {
              void handleCut();
            }}
          >
            <Icon icon={ScissorIcon} />
            Recortar
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            className="rounded-xl"
            onClick={() => {
              void handlePaste();
            }}
          >
            <Icon icon={ClipboardIcon} />
            Colar
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>

        <ContextMenuSeparator />

        <ContextMenuGroup>
          <ContextMenuLabel>Ações</ContextMenuLabel>
          <ContextMenuItem
            className="rounded-xl"
            disabled={!menuState.hasSelection}
            onClick={() => {
              void copySelectionForMessaging(editor);
            }}
          >
            <Icon icon={Message01Icon} />
            Formatar para app de mensagem
          </ContextMenuItem>
          {noteId ? (
            <ContextMenuItem
              className="rounded-xl"
              disabled={!menuState.hasSelection}
              onClick={handleAddToChat}
            >
              <Icon icon={BubbleChatAddIcon} />
              Adicionar ao chat
            </ContextMenuItem>
          ) : null}
        </ContextMenuGroup>

        {menuState.linkHref ? (
          <>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuLabel>Link</ContextMenuLabel>
              <ContextMenuItem
                className="rounded-xl"
                onClick={() => {
                  void handleCopyLink();
                }}
              >
                <Icon icon={Link01Icon} />
                Copiar link
              </ContextMenuItem>
              <ContextMenuItem className="rounded-xl" onClick={handleOpenLink}>
                <Icon icon={LinkSquare02Icon} />
                Abrir link
              </ContextMenuItem>
            </ContextMenuGroup>
          </>
        ) : null}

        <ContextMenuSeparator />

        <ContextMenuGroup>
          <ContextMenuLabel>Formatação</ContextMenuLabel>
          <ContextMenuItem
            className="rounded-xl"
            disabled={!menuState.hasSelection}
            onClick={handleClearFormatting}
          >
            <Icon icon={Eraser01Icon} />
            Limpar formatação
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
