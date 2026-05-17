"use client";

import { Icon } from "@/components/shared/Icon";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import type { SlashCommandItem } from "./slashCommands";
import { Separator } from "../../separator";

interface Props {
  items: SlashCommandItem[];
  selectedIndex: number;
  onSelect: (item: SlashCommandItem) => void;
}

export function SlashCommandList({ items, selectedIndex, onSelect }: Props) {
  if (!items.length) return null;

  const selectedId = items[selectedIndex]?.id;

  // Group items preserving insertion order
  const groups = new Map<string, SlashCommandItem[]>();
  for (const item of items) {
    if (!groups.has(item.group)) groups.set(item.group, []);
    groups.get(item.group)?.push(item);
  }

  const groupEntries = [...groups.entries()];

  return (
    <Command
      shouldFilter={false}
      value={selectedId}
      className="w-62 rounded-xl border border-border shadow-md"
    >
      <CommandList className="max-h-80">
        <CommandEmpty className="text-muted-foreground py-4 text-sm">
          Nenhum comando encontrado
        </CommandEmpty>
        {groupEntries.map(([groupLabel, groupItems], groupIdx) => (
          <div key={groupLabel}>
            {groupIdx > 0 && <Separator />}
            <CommandGroup heading={groupLabel} >
              {groupItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => onSelect(item)}
                  className="gap-2 rounded-xl"
                >
                  {item.icon && <Icon icon={item.icon} />}
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </Command>
  );
}
