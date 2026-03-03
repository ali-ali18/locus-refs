"use client";

import { Folder01Icon, Plus } from "@hugeicons/core-free-icons";
import type { Collection } from "@/types/collection.type";
import { EmpetyApp } from "../base/EmpetyApp";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";
import { CollectionItem } from "./CollectionItem";

interface CollectionSidebarProps {
  collections: Collection[];
  selectedCollectionId: string | null;
  onSelectCollection: (id: string) => void;
  handleDialog?: () => void;
}

export function CollectionSidebar({
  collections,
  selectedCollectionId,
  onSelectCollection,
  handleDialog,
}: CollectionSidebarProps) {
  if (collections.length === 0) {
    return (
      <EmpetyApp
        className="border"
        title="Você ainda não tem nenhuma collection"
        description="Crie uma nova collection para começar a organizar seus recursos"
        icon={Folder01Icon}
        action={
          <Button
            variant="secondary"
            rounded="full"
            size="lg"
            onClick={handleDialog}
          >
            <Icon icon={Plus} /> Nova Collection
          </Button>
        }
      />
    );
  }

  return (
    <div className="sticky top-24 h-fit border rounded-3xl p-5 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5.5 px-2">
        <h2 className="text-muted-foreground font-medium text-sm uppercase tracking-wider">
          Collections
        </h2>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
          {collections.length}
        </span>
      </div>

      <div className="space-y-3.5">
        {collections.map((item) => (
          <CollectionItem
            key={item.id}
            name={item.name}
            isActive={item.id === selectedCollectionId}
            onClick={() => onSelectCollection(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
