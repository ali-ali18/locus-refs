"use client";

import { Image01Icon } from "@hugeicons/core-free-icons";
import type { Editor } from "@tiptap/react";
import { Icon } from "@/components/shared/Icon";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ImageInsertTabs } from "./ImageInsertTabs";

interface Props {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadImage: (file: File) => Promise<string>;
}

export function ImagePopover({ editor, open, onOpenChange, uploadImage }: Props) {
  const handleInsert = (src: string) => {
    editor.chain().focus().setImage({ src }).run();
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        className={buttonVariants({ variant: "ghost", size: "icon", rounded: "xl" })}
        type="button"
      >
        <Icon icon={Image01Icon} />
      </PopoverTrigger>

      <PopoverContent className="w-82 rounded-xl p-3" side="bottom" sideOffset={8}>
        <PopoverHeader>
          <PopoverTitle className="text-base">Inserir imagem</PopoverTitle>
          <PopoverDescription>
            Faça upload de um arquivo ou insira uma URL
          </PopoverDescription>
        </PopoverHeader>
        <ImageInsertTabs uploadImage={uploadImage} onInsert={handleInsert} />
      </PopoverContent>
    </Popover>
  );
}
