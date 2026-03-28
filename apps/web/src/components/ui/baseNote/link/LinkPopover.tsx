"use client";

import { ArrowRight02Icon, Link01Icon } from "@hugeicons/core-free-icons";
import type { Editor } from "@tiptap/react";
import { useState } from "react";
import { InputGroupApp } from "@/components/base";
import { Icon } from "@/components/shared/Icon";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  editor: Editor;
  onOpenChange?: (open: boolean) => void;
  isActive?: boolean;
}

function looksLikeUrl(text: string): boolean {
  return /^https?:\/\//i.test(text) || /^www\./i.test(text);
}

export function LinkPopover({ editor, onOpenChange, isActive }: Props) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (next) {
      if (isActive) {
        setUrl(editor.getAttributes("link").href ?? "");
      } else {
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);
        setUrl(looksLikeUrl(selectedText) ? selectedText : "");
      }
    }
    setOpen(next);
    onOpenChange?.(next);
  };

  const handleApply = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const href = looksLikeUrl(trimmed) ? trimmed : `https://${trimmed}`;
    editor.chain().focus().setLink({ href }).run();
    setOpen(false);
    onOpenChange?.(false);
  };

  const handleRemove = () => {
    editor.chain().focus().unsetLink().run();
    setOpen(false);
    onOpenChange?.(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
    if (e.key === "Escape") {
      setOpen(false);
      onOpenChange?.(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon", rounded: "xl" }),
          isActive && "bg-muted dark:bg-muted/50",
        )}
        type="button"
      >
        <Icon icon={Link01Icon} />
      </PopoverTrigger>

      <PopoverContent
        className="w-72 rounded-xl p-2"
        side="bottom"
        sideOffset={8}
      >
        <PopoverHeader>
          <PopoverTitle className={"text-base"}>
            {isActive ? "Editar link" : "Criando um link"}
          </PopoverTitle>
          <PopoverDescription>
            {isActive
              ? "Para editar o link atual, digite uma nova URL"
              : "Para criar um link, digite uma URL válida"}
          </PopoverDescription>
        </PopoverHeader>
        <InputGroupApp
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          firstElement={<Icon icon={Link01Icon} />}
          align="inline-end"
          lastElement={
            <Button
              size="icon-sm"
              variant={"secondary"}
              rounded="xl"
              type="button"
              onClick={handleApply}
            >
              <Icon icon={ArrowRight02Icon} />
            </Button>
          }
        />

        {isActive && (
          <Button
            variant="destructive"
            size="sm"
            rounded="xl"
            type="button"
            onClick={handleRemove}
          >
            Remover link
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
