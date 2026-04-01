/** biome-ignore-all lint/suspicious/noArrayIndexKey: Index serve apenas para marcar os skelletons*/
"use client";

import {
  Add01Icon,
  ChevronDown,
  Folder01Icon,
  Folder02Icon,
  MinusSignIcon,
  MoreHorizontalCircle01Icon,
  PencilEdit01Icon,
  Plus,
  Trash2,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { CreateCollectionDialog } from "@/components/dashboard/CreateCollectionDialog";
import { EditCollectionDialog } from "@/components/dashboard/EditCollectionDialog";
import { Icon } from "@/components/shared/Icon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useCollectionCategories } from "@/hook/collections/useCollectionCategories";
import { Skeleton } from "../ui/skeleton";
import { useNavMain } from "./hook/useNavMain";

export function NavMain() {
  const {
    collections,
    collectionSlice,
    isLoading,
    activeCategorySlug,
    openCollections,
    toggleCollection,
    isCollectionActive,
    isCreateOpen,
    setIsCreateOpen,
    isAllCollections,
    setIsAllCollections,
    collectionToEdit,
    setCollectionToEdit,
    handleDelete,
    handleCategoryClick,
    workspaceSlug,
  } = useNavMain();

  if (isLoading) {
    const skeletons = Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="w-full h-8 rounded-xl" />
    ));

    return <div className="p-2 space-y-2">{skeletons}</div>;
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

        <SidebarGroupContent>
          <SidebarMenu>
            {collectionSlice.map((collection) => (
              <SidebarMenuItem key={collection.id}>
                <SidebarMenuButton
                  tooltip={collection.name}
                  suppressHydrationWarning
                  isActive={isCollectionActive(collection.id)}
                  render={
                    <Link
                      href={`/${workspaceSlug}/collections/${collection.id}`}
                    />
                  }
                  onClick={() => toggleCollection(collection.id)}
                >
                  <Icon icon={Folder01Icon} />
                  <span>{collection.name}</span>
                </SidebarMenuButton>

                <CollectionCategories
                  collectionId={collection.id}
                  activeCategorySlug={activeCategorySlug}
                  open={openCollections.has(collection.id)}
                  onOpenChange={() => toggleCollection(collection.id)}
                  onCategoryClick={handleCategoryClick}
                  onEditClick={() =>
                    setCollectionToEdit({
                      id: collection.id,
                      name: collection.name,
                    })
                  }
                  onDeleteClick={() => handleDelete(collection.id)}
                />
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
        </SidebarGroupContent>
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

interface CollectionCategoriesProps {
  collectionId: string;
  activeCategorySlug: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryClick: (collectionId: string, categorySlug: string) => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

function CollectionCategories({
  collectionId,
  activeCategorySlug,
  open,
  onOpenChange,
  onCategoryClick,
  onEditClick,
  onDeleteClick,
}: CollectionCategoriesProps) {
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCollectionCategories(collectionId);

  const hasCategories = categories.length > 0;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          suppressHydrationWarning
          render={
            <SidebarMenuAction
              showOnHover
              className={
                hasCategories
                  ? "right-6 aria-expanded:bg-muted"
                  : "aria-expanded:bg-muted"
              }
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
          <DropdownMenuItem onClick={onEditClick}>
            <Icon icon={PencilEdit01Icon} />
            <span>Renomear</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={onDeleteClick}
          >
            <Icon icon={Trash2} />
            <span>Deletar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {hasCategories && (
        <Collapsible
          open={open}
          onOpenChange={onOpenChange}
          className="group/collapsible"
        >
          <CollapsibleTrigger
            render={<SidebarMenuAction className="aria-expanded:bg-muted" />}
          >
            <Icon
              icon={ChevronDown}
              className="transition-transform duration-300 group-data-open/collapsible:rotate-180"
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {isLoadingCategories ? (
                <Skeleton className="h-7 w-full rounded-xl ml-2" />
              ) : (
                categories.map((category) => (
                  <SidebarMenuSubItem key={category.id}>
                    <SidebarMenuSubButton
                      className="rounded-xl"
                      isActive={activeCategorySlug === category.slug}
                      onClick={() =>
                        onCategoryClick(collectionId, category.slug)
                      }
                    >
                      <Icon icon={Folder02Icon} />
                      <span>{category.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {category._count.resources}
                      </span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  );
}
