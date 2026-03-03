"use client";

import { Folder01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CollectionItemProps {
  name: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function CollectionItem({
  name,
  isActive,
  onClick,
}: CollectionItemProps) {
  return (
      <Button
        variant="ghost"
        rounded="xl"
        size="lg"
        onClick={onClick}
        className={cn(
          "w-full justify-between group transition-all duration-200",
          isActive
            ? "bg-secondary/70 text-foreground hover:bg-secondary font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
        )}
      >
        <div className="flex items-center gap-3 truncate">
          <Icon
            icon={Folder01Icon}
            className={cn(
              "size-4 shrink-0 transition-transform group-hover:scale-110",
              isActive && "text-primary",
            )}
          />
          <span className="truncate">{name}</span>
        </div>
      </Button>
  );
}
