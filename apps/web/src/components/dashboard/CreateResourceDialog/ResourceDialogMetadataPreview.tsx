"use client";

import type { Metadata } from "../services/useFetchMetadata";

interface ResourceDialogMetadataPreviewProps {
  metadata: Metadata;
}

export function ResourceDialogMetadataPreview({
  metadata,
}: ResourceDialogMetadataPreviewProps) {
  if (!metadata.iconUrl && !metadata.ogImageUrl) return null;

  return (
    <div className="rounded-xl border p-3 space-y-3">
      <div className="flex items-center gap-3">
        {metadata.iconUrl ? (
          <img
            src={metadata.iconUrl}
            alt="Logo do site"
            className="size-10 rounded-md border object-contain bg-background"
          />
        ) : (
          <div className="size-10 rounded-md border bg-muted" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {metadata.title ?? "Sem título"}
          </p>
          {metadata.description ? (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {metadata.description}
            </p>
          ) : null}
        </div>
      </div>
      {metadata.ogImageUrl ? (
        <img
          src={metadata.ogImageUrl}
          alt="Imagem de preview"
          className="w-full h-28 rounded-lg border object-cover"
        />
      ) : null}
    </div>
  );
}
