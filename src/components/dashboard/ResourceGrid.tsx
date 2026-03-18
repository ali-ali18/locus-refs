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
import { getInitials } from "@/lib/utils";
import { EmptyApp } from "../base/EmptyApp";
import { Skeleton } from "../ui/skeleton";
import { EditResourceDialog } from "./EditResourceDialog";
import { useResourceMutations } from "./hooks/useResourceMutations";

interface ResourceGridProps {
  resources: ResourceFromApi[];
  isLoading?: boolean;
}

export function ResourceGrid({ resources, isLoading }: ResourceGridProps) {
  const [resourceBeingEdited, setResourceBeingEdited] =
    useState<ResourceFromApi | null>(null);

  const { deleteResource, isDeletingResource } = useResourceMutations();

  const [resourceIdToDelete, setResourceIdToDelete] = useState<string | null>(
    null,
  );

  const handleConfirmDelete = () => {
    if (resourceIdToDelete) {
      deleteResource(resourceIdToDelete);
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
      <EmptyApp
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
            onEdit={() => setResourceBeingEdited(resource)}
            onDelete={() => setResourceIdToDelete(resource.id)}
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

      <EditResourceDialog
        open={resourceBeingEdited != null}
        onOpenChange={(open) => !open && setResourceBeingEdited(null)}
        resource={resourceBeingEdited}
      />
    </>
  );
}
