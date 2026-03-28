"use client";

import { useState } from "react";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImage(file: File): Promise<string> {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/notes", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string }).error ??
            "Erro ao fazer upload da imagem.",
        );
      }
      const { data } = (await res.json()) as { data: { publicUrl: string } };
      return data.publicUrl;
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Erro ao fazer upload da imagem.");
    } finally {
      setIsUploading(false);
    }
  }

  return { uploadImage, isUploading };
}
