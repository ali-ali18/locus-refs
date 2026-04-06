"use client";

import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@/components/shared/Icon";
import { cn } from "@/lib/utils";

interface CarouselItem {
  id: string;
  label: string;
  icon: IconSvgElement;
}

interface ConfigNavCarouselProps {
  items: CarouselItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function ConfigNavCarousel({
  items,
  activeId,
  onSelect,
}: ConfigNavCarouselProps) {
  return (
    <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex gap-2 w-max">
        {items.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm whitespace-nowrap transition-colors",
              activeId === id
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            <Icon icon={icon} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
