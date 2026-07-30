"use client";

import { Note01FreeIcons } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/shared/Icon";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { resolveIcon } from "@/lib/icons";
import type { WikiLinkItem } from "./types";

interface Props {
  items: WikiLinkItem[];
  selectedIndex: number;
  onSelect: (item: WikiLinkItem) => void;
}

export function WikiLinkList({ items, selectedIndex, onSelect }: Props) {
  const selectedId = items[selectedIndex]?.id;

  return (
    <Command
      shouldFilter={false}
      value={selectedId}
      className="w-72 rounded-xl border border-border shadow-md"
    >
      <CommandList className="max-h-72">
        <CommandEmpty className="py-4 text-sm text-muted-foreground">
          Nenhuma nota encontrada
        </CommandEmpty>
        <CommandGroup heading="Notas">
          {items.map((item) => (
            <CommandItem
              key={item.id}
              value={item.id}
              onSelect={() => onSelect(item)}
              className="gap-2 rounded-xl"
            >
              <Icon
                icon={item.icon ? resolveIcon(item.icon) : Note01FreeIcons}
              />
              <span className="truncate">{item.title || "Sem título"}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
