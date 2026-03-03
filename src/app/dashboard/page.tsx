"use client";

import { CollectionSidebar } from "@/components/dashboard/CollectionSidebar";
import { CreateCollectionDialog } from "@/components/dashboard/CreateCollectionDialog";
import {
  CreateResourceDialog,
  type CreateResourceDialogCategoryActions,
  type CreateResourceDialogMetadataState,
  type CreateResourceDialogResourceActions,
} from "@/components/dashboard/CreateResourceDialog";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EditResourceDialog } from "@/components/dashboard/EditResourceDialog";
import { useDashboardPage } from "@/components/dashboard/hooks/useDashboardPage";
import { ResourceGrid } from "@/components/dashboard/ResourceGrid";
import { ResourceHeader } from "@/components/dashboard/ResourceHeader";
import { Container } from "@/components/shared/Container";
import type { Collection } from "@/types/collection.type";
import type { UpdateResourceBody } from "@/types/resources";

interface CreateResourceDialogContainerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFetchMetadataRequest: (url: string) => void;
  metadataState: CreateResourceDialogMetadataState;
  defaultCollectionId: string | null;
  collections: Collection[];
  categoryActions: CreateResourceDialogCategoryActions;
  resourceActions: CreateResourceDialogResourceActions;
}

function CreateResourceDialogContainer({
  open,
  onOpenChange,
  onFetchMetadataRequest,
  metadataState,
  defaultCollectionId,
  collections,
  categoryActions,
  resourceActions,
}: CreateResourceDialogContainerProps) {
  return (
    <CreateResourceDialog
      open={open}
      onOpenChange={onOpenChange}
      onFetchMetadataRequest={onFetchMetadataRequest}
      metadataState={metadataState}
      defaultCollectionId={defaultCollectionId}
      collections={collections}
      categoryActions={categoryActions}
      resourceActions={resourceActions}
    />
  );
}

export default function DashboardPage() {
  const {
    isDialogOpen,
    setIsDialogOpen,
    openCreateCollectionDialog,
    createCollection,
    isCreating,
    isOpenDialogCreateResource,
    handleResourceDialogOpenChange,
    openCreateResourceDialog,
    setUrlToFetch,
    metadata,
    isFetchingMetadata,
    metadataError,
    selectedCollectionId,
    selectedCollection,
    collections,
    categories,
    createCategory,
    isCreatingCategory,
    createResource,
    isCreatingResource,
    deleteResource,
    isDeletingResource,
    updateResource,
    isUpdatingResource,
    resourceBeingEdited,
    openEditResource,
    handleEditResourceDialogOpenChange,
    resources,
    isLoadingResources,
    setSelectedCollectionId,
    deleteCollection,
    isDeleting,
    isUpdating,
    updateCollection,
    searchQuery,
    setSearchQuery,
  } = useDashboardPage();

  return (
    <Container as="section" className="my-12 flex flex-col gap-8">
      <DashboardHeader handleDialog={openCreateCollectionDialog} />

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
        <div className="hidden md:block sticky top-24">
          <CollectionSidebar
            collections={collections}
            selectedCollectionId={selectedCollectionId}
            onSelectCollection={setSelectedCollectionId}
            handleDialog={openCreateCollectionDialog}
          />
        </div>

        <div className="flex flex-col gap-6 w-full min-w-0 ">
          <ResourceHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleOpenDialogCreateResource={openCreateResourceDialog}
            title={selectedCollection?.name ?? "Selecione uma coleção"}
            resourcesCount={resources.length}
            collectionId={selectedCollectionId}
            onDeleteCollection={() =>
              deleteCollection(selectedCollectionId ?? "")
            }
            isDeleting={isDeleting}
            onUpdateCollection={(id, name) => updateCollection({ id, name })}
            isUpdating={isUpdating}
          />
          <ResourceGrid
            resources={resources}
            isLoading={isLoadingResources}
            onDeleteResource={deleteResource}
            isDeletingResource={isDeletingResource}
            onEditResource={openEditResource}
          />
        </div>
      </div>

      <CreateResourceDialogContainer
        open={isOpenDialogCreateResource}
        onOpenChange={handleResourceDialogOpenChange}
        onFetchMetadataRequest={setUrlToFetch}
        metadataState={{
          metadata: metadata ?? null,
          isFetchingMetadata,
          metadataError: metadataError ?? null,
        }}
        defaultCollectionId={selectedCollectionId}
        collections={collections}
        categoryActions={{
          categories,
          onCreateCategory: createCategory,
          isCreatingCategory,
        }}
        resourceActions={{
          onCreateResource: createResource,
          isCreating: isCreatingResource,
        }}
      />

      <CreateCollectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateCollection={createCollection}
        isCreating={isCreating}
      />

      <EditResourceDialog
        open={resourceBeingEdited != null}
        onOpenChange={handleEditResourceDialogOpenChange}
        resource={resourceBeingEdited}
        collections={collections}
        categories={categories}
        onUpdateResource={(id, body: UpdateResourceBody) =>
          updateResource(id, body)
        }
        isUpdating={isUpdatingResource}
      />
    </Container>
  );
}
