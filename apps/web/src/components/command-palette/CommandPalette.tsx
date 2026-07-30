"use client";

import {
  BubbleChatIcon,
  DashboardSquare01Icon,
  Folder01FreeIcons,
  Folder02Icon,
  Home01Icon,
  Note01FreeIcons,
  PlusSignIcon,
  Search01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/shared/Icon";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useChatPanel } from "@/context/chatPanel";
import { useCommandPalette } from "@/context/commandPalette";
import { useSettingsDialog } from "@/context/settingsDialog";
import { useWorkspace } from "@/context/workspace";
import { useBoards } from "@/hook/boards/useBoards";
import { useCollections } from "@/hook/collections/useCollections";
import { useNoteMutations } from "@/hook/notes/useNote";
import { useNotes } from "@/hook/notes/useNotes";
import { resolveIcon } from "@/lib/icons";

const LIST_LIMIT = 20;

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export function CommandPalette() {
  const { open, setOpen, toggle } = useCommandPalette();
  const { workspaceSlug } = useWorkspace();
  const router = useRouter();
  const { toggle: toggleChat } = useChatPanel();
  const { openSettings } = useSettingsDialog();
  const { createNote, isLoading: isCreatingNote } = useNoteMutations();
  const { data: notes = [] } = useNotes();
  const { collections } = useCollections();
  const { data: boards = [] } = useBoards();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== "k" ||
        !(event.metaKey || event.ctrlKey)
      ) {
        return;
      }

      if (!open && isEditableTarget(event.target)) {
        return;
      }

      event.preventDefault();
      toggle();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, toggle]);

  function run(action: () => void) {
    setOpen(false);
    action();
  }

  function navigate(path: string) {
    run(() => router.push(path));
  }

  function navigateToNoteFolder(collectionId: string) {
    const folderNotes = notes.filter((note) => note.collectionId === collectionId);

    if (folderNotes.length === 0) {
      navigate(`/${workspaceSlug}/notes`);
      return;
    }

    const latestNote = [...folderNotes].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )[0];

    navigate(`/${workspaceSlug}/notes/${latestNote.id}`);
  }

  async function handleCreateNote() {
    setOpen(false);
    try {
      const note = await createNote({ title: "Sem título" });
      router.push(`/${workspaceSlug}/notes/${note.id}`);
    } catch {
      // Erro já tratado com toast em useNoteMutations
    }
  }

  const noteItems = notes.slice(0, LIST_LIMIT);
  const noteFolderItems = collections
    .filter((collection) => collection.isNoteCollection)
    .slice(0, LIST_LIMIT);
  const resourceCollectionItems = collections
    .filter((collection) => !collection.isNoteCollection)
    .slice(0, LIST_LIMIT);
  const boardItems = boards.slice(0, LIST_LIMIT);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Buscar"
      description="Navegue pelo workspace ou execute uma ação."
    >
      <Command>
        <CommandInput placeholder="Buscar páginas, notas, pastas, coleções..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

          <CommandGroup heading="Navegação">
            <CommandItem
              value="inicio home"
              onSelect={() => navigate(`/${workspaceSlug}`)}
            >
              <Icon icon={Home01Icon} />
              Início
            </CommandItem>
            <CommandItem
              value="notas notes"
              onSelect={() => navigate(`/${workspaceSlug}/notes`)}
            >
              <Icon icon={Note01FreeIcons} />
              Notas
            </CommandItem>
            <CommandItem
              value="colecoes recursos collections"
              onSelect={() => navigate(`/${workspaceSlug}/collections`)}
            >
              <Icon icon={Folder01FreeIcons} />
              Coleções
            </CommandItem>
            <CommandItem
              value="boards"
              onSelect={() => navigate(`/${workspaceSlug}/boards`)}
            >
              <Icon icon={DashboardSquare01Icon} />
              Boards
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Ações">
            <CommandItem
              value="nova nota criar"
              disabled={isCreatingNote}
              onSelect={() => {
                void handleCreateNote();
              }}
            >
              <Icon icon={PlusSignIcon} />
              Nova nota
            </CommandItem>
            <CommandItem
              value="ask ai assistente chat"
              onSelect={() => run(() => toggleChat())}
            >
              <Icon icon={BubbleChatIcon} />
              Ask AI
            </CommandItem>
            <CommandItem
              value="configuracoes settings"
              onSelect={() => run(() => openSettings())}
            >
              <Icon icon={Settings01Icon} />
              Configurações
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {noteItems.length > 0 && (
            <CommandGroup heading="Notas">
              {noteItems.map((note) => (
                <CommandItem
                  key={note.id}
                  value={`nota ${note.title}`}
                  onSelect={() =>
                    navigate(`/${workspaceSlug}/notes/${note.id}`)
                  }
                >
                  {note.icon ? (
                    <Icon icon={resolveIcon(note.icon)} />
                  ) : (
                    <Icon icon={Note01FreeIcons} />
                  )}
                  <span className="truncate">{note.title || "Sem título"}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {noteFolderItems.length > 0 && (
            <CommandGroup heading="Pastas de notas">
              {noteFolderItems.map((collection) => (
                <CommandItem
                  key={collection.id}
                  value={`pasta notas ${collection.name}`}
                  onSelect={() => navigateToNoteFolder(collection.id)}
                >
                  <Icon
                    icon={Folder02Icon}
                    style={{ color: collection.color ?? undefined }}
                  />
                  <span className="truncate">{collection.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {resourceCollectionItems.length > 0 && (
            <CommandGroup heading="Coleções">
              {resourceCollectionItems.map((collection) => (
                <CommandItem
                  key={collection.id}
                  value={`colecao recursos ${collection.name}`}
                  onSelect={() =>
                    navigate(`/${workspaceSlug}/collections/${collection.id}`)
                  }
                >
                  <Icon
                    icon={Folder01FreeIcons}
                    style={{ color: collection.color ?? undefined }}
                  />
                  <span className="truncate">{collection.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {boardItems.length > 0 && (
            <CommandGroup heading="Boards">
              {boardItems.map((board) => (
                <CommandItem
                  key={board.id}
                  value={`board ${board.title}`}
                  onSelect={() =>
                    navigate(`/${workspaceSlug}/boards/${board.id}`)
                  }
                >
                  {board.icon ? (
                    <Icon icon={resolveIcon(board.icon)} />
                  ) : (
                    <Icon icon={DashboardSquare01Icon} />
                  )}
                  <span className="truncate">{board.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

export function CommandPaletteTrigger({
  className,
}: {
  className?: string;
}) {
  const { toggle } = useCommandPalette();
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");

  useEffect(() => {
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    setShortcutLabel(isMac ? "⌘K" : "Ctrl K");
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className={
        className ??
        "flex h-8 w-full items-center gap-2 rounded-xl border border-border bg-background px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground group-data-[collapsible=icon]:hidden"
      }
    >
      <Icon icon={Search01Icon} className="size-4 shrink-0" />
      <span className="flex-1 truncate text-left">Buscar...</span>
      <kbd className="pointer-events-none shrink-0 rounded-md border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        {shortcutLabel}
      </kbd>
    </button>
  );
}
