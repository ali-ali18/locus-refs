"use client";

import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import type { Editor } from "@tiptap/react";
import { useState } from "react";
import { InputGroupApp } from "@/components/base";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resolveProvider } from "@/lib/embed/resolveProvider";

interface Props {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PluginDialog({ editor, open, onOpenChange }: Props) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInsert = () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    const resolved = resolveProvider(trimmed);
    if (!resolved) {
      setError("URL não suportada. Por enquanto só YouTube.");
      return;
    }

    editor
      .chain()
      .focus()
      .insertContent({
        type: "pluginBlock",
        attrs: {
          url: resolved.url,
          provider: resolved.provider,
          providerId: resolved.providerId,
        },
      })
      .run();

    setUrl("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setUrl("");
          setError(null);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="rounded-xl sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Inserir YouTube</DialogTitle>
          <DialogDescription>
            Cole a URL do YouTube para incorporar na nota
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 space-y-2">
          <InputGroupApp
            placeholder="https://youtu.be/..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleInsert();
              }
            }}
            autoFocus
            align="inline-end"
            lastElement={
              <Button
                size="icon-sm"
                variant="secondary"
                rounded="xl"
                type="button"
                onClick={handleInsert}
              >
                <Icon icon={ArrowRight02Icon} />
              </Button>
            }
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
