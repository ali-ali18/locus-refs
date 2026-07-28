import type { Editor } from "@tiptap/react";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/clipboard";
import { selectionToMessageText } from "@/lib/notes-messaging";

export async function copySelectionForMessaging(
  editor: Editor,
): Promise<boolean> {
  const text = selectionToMessageText(editor).trim();
  if (!text) {
    toast.message("Selecione um texto para copiar");
    return false;
  }

  try {
    await copyToClipboard(text);
    toast.success("Formatado e copiado para app de mensagem");
    return true;
  } catch {
    toast.error("Não foi possível copiar. Tente novamente.");
    return false;
  }
}
