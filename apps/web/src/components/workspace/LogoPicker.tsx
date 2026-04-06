/** biome-ignore-all lint/performance/noImgElement: The image runs on the client side */
"use client";

import { useState } from "react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import { IconPicker } from "@/components/notes/IconPicker";
import { WorkspaceLogo } from "@/components/sidebar/WorkspaceLogo";
import { Label } from "@/components/ui/label";
import { isIconUrl } from "@/lib/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LogoPickerProps {
  value: string | null;
  onChange: (value: string | undefined) => void;
  onFileChange?: (file: File[] | undefined) => void;
  className?: string;
  showLabel?: boolean;
}

export function LogoPicker({
  value,
  onChange,
  onFileChange,
  className,
  showLabel = true,
}: LogoPickerProps) {
  const [imageFile, setImageFile] = useState<File[]>([]);

  const handleChange = (newValue: string | undefined) => {
    if (!newValue) {
      setImageFile([]);
      onFileChange?.(undefined);
    }
    onChange(newValue);
  };

  const handleFileDrop = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setImageFile([file]);
    onFileChange?.([file]);
    const reader = new FileReader();
    reader.onload = (e: globalThis.ProgressEvent<FileReader>) =>
      handleChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className={className}>
      {showLabel && <Label>Logo</Label>}
      <div className="flex flex-col gap-3 mt-2">
        {(value || imageFile[0]) && (
          <div className="flex items-center justify-center size-14 rounded-xl bg-muted self-start">
            {imageFile[0] ? (
              <img
                src={URL.createObjectURL(imageFile[0])}
                alt="preview"
                className="size-full object-cover rounded-xl"
              />
            ) : (
              <WorkspaceLogo logo={value} className="size-6" />
            )}
          </div>
        )}
        <Tabs
          className={"cursor-pointer"}
          defaultValue={isIconUrl(value) ? "image" : "icon"}
          onValueChange={(tab) => {
            if (tab === "icon") setImageFile([]);
          }}
        >
          <TabsList className="w-full">
            <TabsTrigger value="icon" className="flex-1">
              Ícone
            </TabsTrigger>
            <TabsTrigger value="image" className="flex-1">
              Imagem
            </TabsTrigger>
          </TabsList>

          <TabsContent value="icon" className="mt-2">
            <IconPicker
              value={isIconUrl(value) ? null : (value ?? null)}
              onChange={(name) => handleChange(name ?? undefined)}
            />
          </TabsContent>

          <TabsContent value="image" className="mt-2">
            <Dropzone
              accept={{ "image/*": [] }}
              maxSize={5 * 1024 * 1024}
              src={imageFile.length ? imageFile : undefined}
              onDrop={handleFileDrop}
            >
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
