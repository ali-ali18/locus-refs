"use client";

import type { Editor } from "@tiptap/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageInsertTabs } from "./ImageInsertTabs";

interface Props {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadImage: (file: File) => Promise<string>;
}

export function ImageDialog({ editor, open, onOpenChange, uploadImage }: Props) {
  const handleInsert = (src: string) => {
    editor.chain().focus().setImage({ src }).run();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Inserir imagem</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo ou insira uma URL
          </DialogDescription>
        </DialogHeader>
        <ImageInsertTabs uploadImage={uploadImage} onInsert={handleInsert} />
      </DialogContent>
    </Dialog>
  );
}
