"use client";

import {
  Folder02Icon,
  MoreVerticalIcon,
  PencilEdit01Icon,
  Plus,
  Search01Icon,
  Trash2,
} from "@hugeicons/core-free-icons";
import { type Dispatch, type SetStateAction, useState } from "react";
import { InputGroupApp } from "@/components/base";
import { Icon } from "@/components/shared/Icon";
import { Separator } from "@/components/ui/separator";
import { DropdownMenuApp } from "../base/DropdownMenuApp";
import { Button } from "../ui/button";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { EditCollectionDialog } from "./EditCollectionDialog";

interface ResourceHeaderProps {
  title: string;
  resourcesCount: number;
  collectionId: string | null;
  handleOpenDialogCreateResource: () => void;
  onDeleteCollection: () => void;
  isDeleting: boolean;
  onUpdateCollection: (id: string, name: string) => Promise<unknown>;
  isUpdating: boolean;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

export function ResourceHeader({
  title,
  resourcesCount,
  collectionId,
  handleOpenDialogCreateResource,
  onDeleteCollection,
  isDeleting,
  onUpdateCollection,
  isUpdating,
  searchQuery,
  setSearchQuery,
}: ResourceHeaderProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      <div className="flex items-center gap-1.5">
        <div className="inline-flex items-center gap-3">
          <span className="p-2 border rounded-xl bg-background shadow-sm">
            <Icon icon={Folder02Icon} className="size-6 text-foreground/80" />
          </span>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight inline-flex items-center gap-2">
            {title}
          </h2>
        </div>
        <span className="text-muted-foreground text-sm font-medium ml-1">
          ({resourcesCount} recursos)
        </span>
        <DropdownMenuApp
          trigger={<Icon icon={MoreVerticalIcon} className="size-5" />}
          contentClassName="w-52"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-sm font-medium">
              Funções
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              nativeButton
              className="rounded-xl"
              render={
                <Button
                  variant="ghost"
                  rounded="full"
                  size="lg"
                  className="w-full justify-start"
                  onClick={onDeleteCollection}
                  disabled={isDeleting}
                >
                  <Icon icon={Trash2} className="size-5" /> Deletar
                </Button>
              }
            />
            <DropdownMenuItem
              nativeButton
              className="rounded-xl"
              render={
                <Button
                  variant="ghost"
                  rounded="full"
                  size="lg"
                  className="w-full justify-start"
                  onClick={() => setIsEditDialogOpen(true)}
                  disabled={isUpdating || !collectionId}
                >
                  <Icon icon={PencilEdit01Icon} className="size-5" /> Editar
                </Button>
              }
            />
          </DropdownMenuGroup>
        </DropdownMenuApp>
      </div>

      <div className="w-full flex items-center justify-between gap-2">
        <InputGroupApp
          className="rounded-xl h-10 w-full max-w-md"
          placeholder="Pesquise pelo nome do recurso..."
          align="inline-start"
          firstElement={
            <Icon
              icon={Search01Icon}
              className="size-4 text-muted-foreground"
            />
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Button
          variant="secondary"
          rounded="full"
          size="lg"
          onClick={handleOpenDialogCreateResource}
        >
          <Icon icon={Plus} className="size-4" /> Novo Recurso
        </Button>
      </div>

      <Separator />

      <EditCollectionDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        collectionId={collectionId ?? ""}
        currentName={title}
        onUpdateCollection={onUpdateCollection}
        isUpdating={isUpdating}
      />
    </div>
  );
}
