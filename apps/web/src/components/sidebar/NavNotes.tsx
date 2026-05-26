/** biome-ignore-all lint/suspicious/noArrayIndexKey: Lint removido por se tratar de um elemento sem relevancia */
"use client";

import {
  MinusSignIcon,
  MoreHorizontalCircle01Icon,
  PencilEdit01Icon,
  Plus,
  Trash2,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { EditNoteDialog } from "@/components/notes/EditNoteDialog";
import { Icon } from "@/components/shared/Icon";
import { DialogApp } from "@/components/base/DialogApp";
import { FormCreateNote } from "@/components/notes/FormCreateNote";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { resolveIcon } from "@/lib/icons";
import { Skeleton } from "../ui/skeleton";
import { useNavNotes } from "./hook/useNavNotes";

export function NavNotes() {
  const {
    notes,
    notesSlice,
    isLoading,
    isAllNotes,
    setIsAllNotes,
    isCreateOpen,
    setIsCreateOpen,
    noteToRename,
    setNoteToRename,
    handleDelete,
    workspaceSlug,
    pathname,
  } = useNavNotes();
  const { setOpenMobile, openMobile } = useSidebar();

  if (isLoading) {
    const skeletons = Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="w-full h-8 rounded-xl" />
    ));

    return <div className="p-2 space-y-2 ">{skeletons}</div>;
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Notas</SidebarGroupLabel>
        <SidebarGroupAction
          className="rounded-xl"
          onClick={() => setIsCreateOpen(true)}
          title="Nova nota"
        >
          <Icon icon={Plus} />
        </SidebarGroupAction>

        <SidebarMenu>
          {notesSlice.map((note) => (
            <SidebarMenuItem key={note.id}>
              <SidebarMenuButton
                suppressHydrationWarning
                className="rounded-xl"
                onClick={() => setOpenMobile(!openMobile)}
                render={<Link href={`/${workspaceSlug}/notes/${note.id}`} />}
                isActive={pathname === `/${workspaceSlug}/notes/${note.id}`}
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
                    <DropdownMenuItem
                      onClick={() =>
                        setNoteToRename({
                          id: note.id,
                          title: note.title,
                          icon: note.icon ?? undefined,
                        })
                      }
                    >
                      <Icon icon={PencilEdit01Icon} />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Icon icon={Trash2} />
                      <span>Deletar</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          {notes.length > 3 && (
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
      </SidebarGroup>

      <DialogApp
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Crie uma nova nota"
        description="Crie uma nova nota para fazer anotações de forma organizada, rápida e eficiente"
      >
        <FormCreateNote />
      </DialogApp>

      <EditNoteDialog
        open={noteToRename !== null}
        onOpenChange={(open) => !open && setNoteToRename(null)}
        noteId={noteToRename?.id ?? ""}
        currentTitle={noteToRename?.title ?? ""}
        currentIcon={noteToRename?.icon}
      />
    </>
  );
}
