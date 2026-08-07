"use client";

import { Note01FreeIcons } from "@hugeicons/core-free-icons";
import type { NotePinItem } from "@refstash/shared";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { isIconUrl, resolveIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

function PinIcon({ icon }: { icon: string | null }) {
  if (icon && isIconUrl(icon)) {
    return (
      <img src={icon} alt="" className="size-3.5 rounded object-cover" />
    );
  }

  let resolved = Note01FreeIcons;
  if (icon) {
    try {
      resolved = resolveIcon(icon);
    } catch {
      resolved = Note01FreeIcons;
    }
  }

  return <Icon icon={resolved} className="size-3.5" />;
}

export function PinChip({
  item,
  workspaceSlug,
}: {
  item: NotePinItem;
  workspaceSlug: string;
}) {
  return (
    <Link
      href={`/${workspaceSlug}/notes/${item.id}`}
      className={cn(
        "inline-flex h-8 max-w-[11rem] shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm text-foreground transition-colors",
        "hover:bg-muted",
      )}
      title={item.title || "Sem título"}
    >
      <PinIcon icon={item.icon} />
      <span className="truncate">{item.title || "Sem título"}</span>
    </Link>
  );
}
