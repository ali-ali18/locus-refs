"use client";

import {
  DashboardSquare01Icon,
  Folder01FreeIcons,
  Folder02Icon,
  Note01FreeIcons,
} from "@hugeicons/core-free-icons";
import { useMemo } from "react";
import { Icon } from "@/components/shared/Icon";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useBoards } from "@/hook/boards/useBoards";
import { useCollections } from "@/hook/collections/useCollections";
import { useNotes } from "@/hook/notes/useNotes";
import { resolveIcon } from "@/lib/icons";
import type { AgentMention } from "./hook/useAiChat";

interface ChatMentionPickerProps {
  query: string;
  selectedIds: Set<string>;
  onSelect: (mention: AgentMention) => void;
}

function matchesQuery(label: string, query: string): boolean {
  if (!query) return true;
  return label.toLowerCase().includes(query.toLowerCase());
}

const itemClassName =
  "rounded-xl px-3 py-2 data-selected:bg-accent data-selected:text-accent-foreground [&>*:last-child]:hidden";

export function ChatMentionPicker({
  query,
  selectedIds,
  onSelect,
}: ChatMentionPickerProps) {
  const { data: notes = [] } = useNotes();
  const { collections } = useCollections();
  const { data: boards = [] } = useBoards();

  const noteItems = useMemo(
    () =>
      notes
        .filter((note) => matchesQuery(note.title || "Sem título", query))
        .filter((note) => !selectedIds.has(note.id))
        .slice(0, 8)
        .map((note) => ({
          type: "note" as const,
          id: note.id,
          title: note.title || "Sem título",
          icon: note.icon,
        })),
    [notes, query, selectedIds],
  );

  const noteCollectionItems = useMemo(
    () =>
      collections
        .filter((c) => c.isNoteCollection)
        .filter((c) => matchesQuery(c.name, query))
        .filter((c) => !selectedIds.has(c.id))
        .slice(0, 6)
        .map((c) => ({
          type: "noteCollection" as const,
          id: c.id,
          title: c.name,
          color: c.color,
        })),
    [collections, query, selectedIds],
  );

  const resourceCollectionItems = useMemo(
    () =>
      collections
        .filter((c) => !c.isNoteCollection)
        .filter((c) => matchesQuery(c.name, query))
        .filter((c) => !selectedIds.has(c.id))
        .slice(0, 6)
        .map((c) => ({
          type: "resourceCollection" as const,
          id: c.id,
          title: c.name,
          color: c.color,
        })),
    [collections, query, selectedIds],
  );

  const boardItems = useMemo(
    () =>
      boards
        .filter((board) => matchesQuery(board.title || "Sem título", query))
        .filter((board) => !selectedIds.has(board.id))
        .slice(0, 6)
        .map((board) => ({
          type: "board" as const,
          id: board.id,
          title: board.title || "Sem título",
          icon: board.icon,
        })),
    [boards, query, selectedIds],
  );

  const hasAny =
    noteItems.length > 0 ||
    noteCollectionItems.length > 0 ||
    resourceCollectionItems.length > 0 ||
    boardItems.length > 0;

  return (
    <div className="absolute bottom-full left-0 z-50 mb-2 w-full max-w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-border bg-popover text-popover-foreground shadow-lg">
      <Command shouldFilter={false} className="rounded-3xl p-1.5">
        <CommandList className="max-h-64 scrollbar-none">
          {!hasAny ? (
            <CommandEmpty className="py-8 text-muted-foreground">
              Nada encontrado no workspace.
            </CommandEmpty>
          ) : null}
          {noteItems.length > 0 ? (
            <CommandGroup
              heading="Notas"
              className="p-0 **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:pb-1"
            >
              {noteItems.map((item) => (
                <CommandItem
                  key={`note-${item.id}`}
                  value={`note ${item.title} ${item.id}`}
                  className={itemClassName}
                  onSelect={() =>
                    onSelect({
                      type: item.type,
                      id: item.id,
                      title: item.title,
                    })
                  }
                >
                  <Icon
                    icon={
                      item.icon ? resolveIcon(item.icon) : Note01FreeIcons
                    }
                  />
                  <span className="truncate">{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {noteCollectionItems.length > 0 ? (
            <CommandGroup
              heading="Pastas de notas"
              className="p-0 **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:pb-1"
            >
              {noteCollectionItems.map((item) => (
                <CommandItem
                  key={`nc-${item.id}`}
                  value={`noteCollection ${item.title} ${item.id}`}
                  className={itemClassName}
                  onSelect={() =>
                    onSelect({
                      type: item.type,
                      id: item.id,
                      title: item.title,
                    })
                  }
                >
                  <Icon
                    icon={Folder02Icon}
                    style={{ color: item.color ?? undefined }}
                  />
                  <span className="truncate">{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {resourceCollectionItems.length > 0 ? (
            <CommandGroup
              heading="Coleções"
              className="p-0 **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:pb-1"
            >
              {resourceCollectionItems.map((item) => (
                <CommandItem
                  key={`rc-${item.id}`}
                  value={`resourceCollection ${item.title} ${item.id}`}
                  className={itemClassName}
                  onSelect={() =>
                    onSelect({
                      type: item.type,
                      id: item.id,
                      title: item.title,
                    })
                  }
                >
                  <Icon
                    icon={Folder01FreeIcons}
                    style={{ color: item.color ?? undefined }}
                  />
                  <span className="truncate">{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {boardItems.length > 0 ? (
            <CommandGroup
              heading="Boards"
              className="p-0 **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:pb-1"
            >
              {boardItems.map((item) => (
                <CommandItem
                  key={`board-${item.id}`}
                  value={`board ${item.title} ${item.id}`}
                  className={itemClassName}
                  onSelect={() =>
                    onSelect({
                      type: item.type,
                      id: item.id,
                      title: item.title,
                    })
                  }
                >
                  <Icon
                    icon={
                      item.icon
                        ? resolveIcon(item.icon)
                        : DashboardSquare01Icon
                    }
                  />
                  <span className="truncate">{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
    </div>
  );
}
