"use client";

import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { InputGroupApp } from "@/components/base";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  uploadImage: (file: File) => Promise<string>;
  onInsert: (src: string) => void;
}

export function ImageInsertTabs({ uploadImage, onInsert }: Props) {
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState<File[] | undefined>(undefined);

  const handleUrlInsert = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const raw = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      const parsed = new URL(raw);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return;
      onInsert(parsed.toString());
    } catch {}
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setFiles(acceptedFiles);
    const src = await uploadImage(file);
    onInsert(src);
  };

  return (
    <Tabs defaultValue="upload" className="mt-2">
      <TabsList className="w-full">
        <TabsTrigger value="upload" className="flex-1">
          Upload
        </TabsTrigger>
        <TabsTrigger value="link" className="flex-1">
          Link
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="mt-2">
        <Dropzone
          accept={{ "image/*": [] }}
          maxSize={5 * 1024 * 1024}
          onDrop={handleDrop}
          src={files}
          className="rounded-xl"
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </TabsContent>

      <TabsContent value="link" className="mt-2">
        <InputGroupApp
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleUrlInsert();
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
              onClick={handleUrlInsert}
            >
              <Icon icon={ArrowRight02Icon} />
            </Button>
          }
        />
      </TabsContent>
    </Tabs>
  );
}
