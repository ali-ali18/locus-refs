/** biome-ignore-all lint/suspicious/noArrayIndexKey: Index serve apenas para marcar os skelletons*/
"use client";

import {
  Add01Icon,
  Folder01Icon,
  MinusSignIcon,
  MoreHorizontalCircle01Icon,
  PencilEdit01Icon,
  Plus,
  Trash2,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CreateCollectionDialog } from "@/components/dashboard/CreateCollectionDialog";
import { EditCollectionDialog } from "@/components/dashboard/EditCollectionDialog";
import { Icon } from "@/components/shared/Icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { useCollections } from "@/hook/collections/useCollections";
import { Skeleton } from "../ui/skeleton";

export function NavMain() {
  const { collections, isLoading, deleteCollection } = useCollections();
  const { setOpenMobile, openMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAllCollections, setIsAllCollections] = useState(false);
  const [collectionToEdit, setCollectionToEdit] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const collectionSlice = isAllCollections
    ? collections
    : collections.slice(0, 3);

  const handleDelete = async (id: string) => {
    if (pathname === `/dashboard/collections/${id}`) {
      router.push("/dashboard");
    }
    await deleteCollection(id);
  };

  if (isLoading) {
    const skeletons = Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="w-full h-8 rounded-xl" />
    ));

    return <div className="p-2 space-y-2 ">{skeletons}</div>;
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Recursos</SidebarGroupLabel>
        <SidebarGroupAction
          className="rounded-xl"
          onClick={() => setIsCreateOpen(true)}
          title="Nova coleção"
        >
          <Icon icon={Plus} />
        </SidebarGroupAction>

        <SidebarMenu>
          {collectionSlice.map((collection) => (
            <SidebarMenuItem key={collection.id}>
              <SidebarMenuButton
                suppressHydrationWarning
                className="rounded-xl"
                onClick={() => setOpenMobile(!openMobile)}
                render={
                  <Link href={`/dashboard/collections/${collection.id}`} />
                }
                isActive={
                  pathname === `/dashboard/collections/${collection.id}`
                }
                tooltip={collection.name}
              >
                <Icon icon={Folder01Icon} />
                <span>{collection.name}</span>
              </SidebarMenuButton>

              <DropdownMenu>
                <DropdownMenuTrigger
                  suppressHydrationWarning
                  className={"rounded-xl"}
                  render={
                    <SidebarMenuAction
                      showOnHover
                      className="aria-expanded:bg-muted"
                    />
                  }
                >
                  <Icon icon={MoreHorizontalCircle01Icon} />
                  <span className="sr-only">Mais opções</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  className="w-48 rounded-lg"
                >
                  <DropdownMenuItem
                    onClick={() =>
                      setCollectionToEdit({
                        id: collection.id,
                        name: collection.name,
                      })
                    }
                  >
                    <Icon icon={PencilEdit01Icon} />
                    <span>Renomear</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDelete(collection.id)}
                  >
                    <Icon icon={Trash2} />
                    <span>Deletar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          {collections.length > 3 && (
            <SidebarMenuButton
              onClick={() => setIsAllCollections(!isAllCollections)}
              tooltip={isAllCollections ? "Ver menos" : "Ver mais"}
            >
              {isAllCollections ? (
                <>
                  <Icon icon={MinusSignIcon} />
                  Ver menos
                </>
              ) : (
                <>
                  <Icon icon={Add01Icon} />
                  Ver mais
                </>
              )}
            </SidebarMenuButton>
          )}
        </SidebarMenu>
      </SidebarGroup>

      <CreateCollectionDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <EditCollectionDialog
        open={collectionToEdit !== null}
        onOpenChange={(open) => !open && setCollectionToEdit(null)}
        collectionId={collectionToEdit?.id ?? ""}
        currentName={collectionToEdit?.name ?? ""}
      />
    </>
  );
}
