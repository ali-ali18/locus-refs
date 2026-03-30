/** biome-ignore-all lint/suspicious/noArrayIndexKey: Lint removido por se tratar de um elemento sem relevancia */
"use client";

import { MinusSignIcon, Plus } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DialogApp } from "@/components/base/DialogApp";
import { FormCreateNote } from "@/components/notes/FormCreateNote";
import { Icon } from "@/components/shared/Icon";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspace } from "@/context/workspace";
import { useNotes } from "@/hook/notes/useNotes";
import { resolveIcon } from "@/lib/icons";
import { Skeleton } from "../ui/skeleton";

export function NavNotes() {
  const { data: notes = [], isLoading } = useNotes();
  const { setOpenMobile, openMobile } = useSidebar();
  const { workspaceSlug } = useWorkspace();

  const pathname = usePathname();

  const [isAllNotes, setIsAllNotes] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const notesSlice = isAllNotes ? notes : notes.slice(0, 3);

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
            </SidebarMenuItem>
          ))}
          {notes.length > 3 && (
            <SidebarMenuButton
              tooltip={isAllNotes ? "Ver mais" : "Ver menos"}
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
    </>
  );
}
