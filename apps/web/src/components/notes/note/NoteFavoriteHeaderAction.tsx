"use client";

import { StarIcon } from "@hugeicons/core-free-icons";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { useNotePinMutations } from "@/hook/notes/useNotePins";
import { useNote } from "@/hook/notes/useNotes";
import { cn } from "@/lib/utils";

function getNoteIdFromPath(pathname: string): string | null {
  const match = pathname.match(/\/notes\/([^/]+)\/?$/);
  return match?.[1] ?? null;
}

export function NoteFavoriteHeaderAction() {
  const pathname = usePathname();
  const noteId = useMemo(() => getNoteIdFromPath(pathname), [pathname]);
  const { data: note } = useNote(noteId ?? "");
  const { setFavorite, isUpdatingFavorite } = useNotePinMutations();

  if (!noteId || !note) return null;

  const isFavorite = note.isFavorite ?? false;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={isUpdatingFavorite}
      aria-label={
        isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
      }
      aria-pressed={isFavorite}
      onClick={() => {
        void setFavorite({ noteId, favorite: !isFavorite });
      }}
    >
      <Icon
        icon={StarIcon}
        className={cn(
          "size-4.5",
          isFavorite
            ? "fill-accent-foreground text-accent-foreground"
            : "text-muted-foreground",
        )}
      />
    </Button>
  );
}
