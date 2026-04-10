"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function useWorkspaceLogoUpload() {
  const [isUploading, setIsUploading] = useState(false);

  async function uploadLogo(file: File, workspaceId: string): Promise<string> {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<{ data: { publicUrl: string } }>(
        "/api/upload/workspace-logo",
        formData,
        { headers: { "x-workspace-id": workspaceId } },
      );
      return data.data.publicUrl;
    } finally {
      setIsUploading(false);
    }
  }

  return { uploadLogo, isUploading };
}
