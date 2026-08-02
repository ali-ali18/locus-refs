"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { SparklesIcon } from "lucide-react";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";

export function ChatInputSkillChip({
  title,
  onRemove,
}: {
  title: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex max-w-48 items-center gap-1 rounded-full border border-border bg-muted/60 py-0.5 pr-0.5 pl-2 text-xs text-foreground">
      <SparklesIcon className="size-3 shrink-0 text-muted-foreground" />
      <span className="truncate font-medium">{title}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="size-5 shrink-0 rounded-full"
        aria-label="Remover skill"
        onClick={onRemove}
      >
        <Icon icon={Cancel01Icon} className="size-3" />
      </Button>
    </span>
  );
}
