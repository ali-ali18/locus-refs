/** biome-ignore-all lint/suspicious/noArrayIndexKey: Lint removido por se tratar de um elemento sem relevancia */
"use client";

import {
  ChevronDown,
  Folder01Icon,
  MinusSignIcon,
  MoreHorizontalCircle01Icon,
  NoteEditIcon,
  PencilEdit01Icon,
  Plus,
  Trash2,
} from "@hugeicons/core-free-icons";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import Link from "next/link";
import { useState } from "react";
import { EditNoteDialog } from "@/components/notes/EditNoteDialog";
import { CreateNoteCollectionDialog } from "@/components/notes/CreateNoteCollectionDialog";
import { Icon } from "@/components/shared/Icon";
import { DialogApp } from "@/components/base/DialogApp";
import { FormCreateNote } from "@/components/notes/FormCreateNote";
import { EditCollectionDialog } from "@/components/dashboard/EditCollectionDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { resolveIcon } from "@/lib/icons";
import { Skeleton } from "../ui/skeleton";
import { useNavNotes } from "./hook/useNavNotes";
import type { Note } from "@refstash/shared";

interface DraggableNoteProps {
  note: Note;
  workspaceSlug: string;
  pathname: string;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  sub?: boolean;
}

function DraggableNote({
  note,
  workspaceSlug,
  pathname,
  onSelect,
  onEdit,
  onDelete,
  sub = false,
}: DraggableNoteProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: note.id,
  });

  const isActive = pathname === `/${workspaceSlug}/notes/${note.id}`;

  if (sub) {
    return (
      <SidebarMenuSubItem ref={setNodeRef} {...attributes} {...listeners}>
        <SidebarMenuSubButton
          suppressHydrationWarning
          className={`rounded-xl cursor-grab active:cursor-grabbing ${isDragging ? "opacity-40" : ""}`}
          isActive={isActive}
          render={<Link href={`/${workspaceSlug}/notes/${note.id}`} />}
          onClick={onSelect}
        >
          {note.icon && <Icon icon={resolveIcon(note.icon)} />}
          <span>{note.title}</span>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuItem ref={setNodeRef} {...attributes} {...listeners}>
      <SidebarMenuButton
        suppressHydrationWarning
        className={`rounded-xl cursor-grab active:cursor-grabbing ${isDragging ? "opacity-40" : ""}`}
        onClick={onSelect}
        render={<Link href={`/${workspaceSlug}/notes/${note.id}`} />}
        isActive={isActive}
        tooltip={note.title}
      >
        {note.icon && <Icon icon={resolveIcon(note.icon)} />}
        <span>{note.title}</span>
      </SidebarMenuButton>

      <DropdownMenu>
        <DropdownMenuTrigger
          suppressHydrationWarning
          render={
            <SidebarMenuAction
              showOnHover
              className="aria-expanded:bg-sidebar-primary-foreground/30 text-sidebar-foreground hover:text-sidebar-foreground"
            />
          }
        >
          <Icon icon={MoreHorizontalCircle01Icon} />
          <span className="sr-only">Mais opções</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          className="w-48 rounded-xl"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={onEdit}>
              <Icon icon={PencilEdit01Icon} />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Icon icon={Trash2} />
              <span>Deletar</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

interface DroppableCollectionProps {
  collection: {
    id: string;
    name: string;
    color: string | null;
    description: string | null;
    notes: Note[];
  };
  open: boolean;
  onOpenChange: () => void;
  workspaceSlug: string;
  pathname: string;
  onEditCollection: () => void;
  onDeleteCollection: () => void;
  onSelectNote: () => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

function DroppableCollection({
  collection,
  open,
  onOpenChange,
  workspaceSlug,
  pathname,
  onEditCollection,
  onDeleteCollection,
  onSelectNote,
  onEditNote,
  onDeleteNote,
}: DroppableCollectionProps) {
  const { setNodeRef, isOver } = useDroppable({ id: collection.id });
  const hasNotes = collection.notes.length > 0;

  return (
    <SidebarMenuItem
      ref={setNodeRef}
      className={isOver ? "bg-sidebar-accent rounded-xl" : ""}
    >
      <SidebarMenuButton
        suppressHydrationWarning
        className="rounded-xl"
        tooltip={collection.name}
        onClick={onOpenChange}
      >
        <span
          className="size-2 rounded-full flex-shrink-0 border border-border/50"
          style={{ backgroundColor: collection.color ?? undefined }}
        />
        <span>{collection.name}</span>
      </SidebarMenuButton>

      <DropdownMenu>
        <DropdownMenuTrigger
          suppressHydrationWarning
          render={
            <SidebarMenuAction
              showOnHover
              className={`aria-expanded:bg-sidebar-primary-foreground/30 text-sidebar-foreground hover:text-sidebar-foreground${hasNotes ? " right-6" : ""}`}
            />
          }
        >
          <Icon icon={MoreHorizontalCircle01Icon} />
          <span className="sr-only">Mais opções</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          className="w-48 rounded-xl"
        >
          <DropdownMenuItem onClick={onEditCollection}>
            <Icon icon={PencilEdit01Icon} />
            <span>Editar</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={onDeleteCollection}
          >
            <Icon icon={Trash2} />
            <span>Deletar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {hasNotes && (
        <Collapsible
          open={open}
          onOpenChange={onOpenChange}
          className="group/collapsible"
        >
          <CollapsibleTrigger
            render={
              <SidebarMenuAction className="text-sidebar-foreground hover:text-sidebar-foreground" />
            }
          >
            <Icon
              icon={ChevronDown}
              strokeWidth={2}
              className="transition-transform duration-300 group-data-open/collapsible:rotate-180"
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {collection.notes.map((note) => (
                <DraggableNote
                  key={note.id}
                  note={note}
                  workspaceSlug={workspaceSlug}
                  pathname={pathname}
                  onSelect={onSelectNote}
                  onEdit={() => onEditNote(note)}
                  onDelete={() => onDeleteNote(note.id)}
                  sub
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      )}
    </SidebarMenuItem>
  );
}

export function NavNotes() {
  const {
    notes,
    collectionsWithNotes,
    ungroupedNotes,
    ungroupedSlice,
    isLoading,
    isAllNotes,
    setIsAllNotes,
    isCreateOpen,
    setIsCreateOpen,
    isCreateCollectionOpen,
    setIsCreateCollectionOpen,
    noteToRename,
    setNoteToRename,
    collectionToEdit,
    setCollectionToEdit,
    openCollections,
    toggleCollection,
    handleDeleteNote,
    handleDeleteCollection,
    updateNote,
    workspaceSlug,
    pathname,
  } = useNavNotes();
  const { setOpenMobile, openMobile } = useSidebar();

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveDragId(null);
    if (!over) return;
    const noteId = active.id as string;
    const collectionId = over.id as string;
    const note = notes.find((n) => n.id === noteId);
    if (!note || note.collectionId === collectionId) return;
    updateNote({ id: noteId, collectionId });
  };

  const activeDragNote = activeDragId
    ? notes.find((n) => n.id === activeDragId)
    : null;

  if (isLoading) {
    const skeletons = Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="w-full h-8 rounded-xl" />
    ));
    return <div className="p-2 space-y-2">{skeletons}</div>;
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Notas</SidebarGroupLabel>

        <DropdownMenu>
          <DropdownMenuTrigger
            suppressHydrationWarning
            render={<SidebarGroupAction className="rounded-xl" title="Novo" />}
          >
            <Icon icon={Plus} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            className="w-52 rounded-xl"
          >
            <DropdownMenuItem onClick={() => setIsCreateOpen(true)}>
              <Icon icon={NoteEditIcon} />
              <span>Criar uma nota</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsCreateCollectionOpen(true)}>
              <Icon icon={Folder01Icon} />
              <span>Criar uma coleção</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DndContext
          sensors={sensors}
          onDragStart={({ active }) => setActiveDragId(active.id as string)}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveDragId(null)}
        >
          <SidebarMenu>
            {collectionsWithNotes.map((collection) => (
              <DroppableCollection
                key={collection.id}
                collection={collection}
                open={openCollections.has(collection.id)}
                onOpenChange={() => toggleCollection(collection.id)}
                workspaceSlug={workspaceSlug}
                pathname={pathname}
                onEditCollection={() =>
                  setCollectionToEdit({
                    id: collection.id,
                    name: collection.name,
                    description: collection.description ?? undefined,
                    color: collection.color ?? undefined,
                  })
                }
                onDeleteCollection={() => handleDeleteCollection(collection.id)}
                onSelectNote={() => setOpenMobile(!openMobile)}
                onEditNote={(note) =>
                  setNoteToRename({
                    id: note.id,
                    title: note.title,
                    icon: note.icon ?? undefined,
                  })
                }
                onDeleteNote={handleDeleteNote}
              />
            ))}

            {ungroupedSlice.map((note) => (
              <DraggableNote
                key={note.id}
                note={note}
                workspaceSlug={workspaceSlug}
                pathname={pathname}
                onSelect={() => setOpenMobile(!openMobile)}
                onEdit={() =>
                  setNoteToRename({
                    id: note.id,
                    title: note.title,
                    icon: note.icon ?? undefined,
                  })
                }
                onDelete={() => handleDeleteNote(note.id)}
              />
            ))}

            {ungroupedNotes.length > 3 && (
              <SidebarMenuButton
                tooltip={isAllNotes ? "Ver menos" : "Ver mais"}
                suppressHydrationWarning
                onClick={() => setIsAllNotes(!isAllNotes)}
              >
                {isAllNotes ? (
                  <>
                    <Icon icon={MinusSignIcon} /> Ver menos
                  </>
                ) : (
                  <>
                    <Icon icon={Plus} /> Ver mais
                  </>
                )}
              </SidebarMenuButton>
            )}
          </SidebarMenu>

          <DragOverlay>
            {activeDragNote && (
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-sidebar border border-border shadow-md text-sm opacity-90">
                {activeDragNote.icon && (
                  <Icon icon={resolveIcon(activeDragNote.icon)} />
                )}
                <span className="truncate">{activeDragNote.title}</span>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </SidebarGroup>

      <DialogApp
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Crie uma nova nota"
        description="Crie uma nova nota para fazer anotações de forma organizada, rápida e eficiente"
      >
        <FormCreateNote />
      </DialogApp>

      <CreateNoteCollectionDialog
        open={isCreateCollectionOpen}
        onOpenChange={setIsCreateCollectionOpen}
      />

      <EditNoteDialog
        open={noteToRename !== null}
        onOpenChange={(open) => !open && setNoteToRename(null)}
        noteId={noteToRename?.id ?? ""}
        currentTitle={noteToRename?.title ?? ""}
        currentIcon={noteToRename?.icon}
      />

      <EditCollectionDialog
        open={collectionToEdit !== null}
        onOpenChange={(open) => !open && setCollectionToEdit(null)}
        collectionId={collectionToEdit?.id ?? ""}
        currentName={collectionToEdit?.name ?? ""}
        currentDescription={collectionToEdit?.description}
        currentColor={collectionToEdit?.color}
      />
    </>
  );
}
