"use client";

import { Folder01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { ResourceCard } from "@/components/dashboard/ResourceCard";
import type { ResourceFromApi } from "@/components/dashboard/services/useResource";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmpetyApp } from "../base/EmpetyApp";
import { Skeleton } from "../ui/skeleton";

function getInitials(title: string): string {
  const words = title.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase().slice(0, 2);
  }
  return title.slice(0, 2).toUpperCase() || "Aa";
}

interface ResourceGridProps {
  resources: ResourceFromApi[];
  isLoading?: boolean;
  onDeleteResource?: (id: string) => void;
  isDeletingResource?: boolean;
  onEditResource?: (resource: ResourceFromApi) => void;
}

export function ResourceGrid({
  resources,
  isLoading,
  onDeleteResource,
  isDeletingResource,
  onEditResource,
}: ResourceGridProps) {
  const [resourceIdToDelete, setResourceIdToDelete] = useState<string | null>(
    null,
  );

  const handleConfirmDelete = () => {
    if (resourceIdToDelete && onDeleteResource) {
      onDeleteResource(resourceIdToDelete);
      setResourceIdToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-40 rounded-xl" aria-hidden />
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <EmpetyApp
        className="border"
        title="Opsss... Nenhum recurso encontrado"
        description="Você ainda não tem nenhum recurso nesta coleção"
        icon={Folder01Icon}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            title={resource.title}
            category={resource.categories[0]?.name ?? ""}
            link={resource.url}
            description={resource.description}
            iconUrl={resource.iconUrl}
            initials={getInitials(resource.title)}
            onEdit={
              onEditResource
                ? () => onEditResource(resource)
                : undefined
            }
            onDelete={
              onDeleteResource
                ? () => setResourceIdToDelete(resource.id)
                : undefined
            }
          />
        ))}
      </div>

      <AlertDialog
        open={resourceIdToDelete != null}
        onOpenChange={(open) => {
          if (!open) setResourceIdToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir recurso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O recurso será removido
              permanentemente da coleção.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeletingResource}
              className="bg-destructive rounded-xl text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingResource ? "Excluindo…" : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
