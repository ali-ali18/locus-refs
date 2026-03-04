"use client";

import { CollectionSidebar } from "@/components/dashboard/CollectionSidebar";
import { CreateCollectionDialog } from "@/components/dashboard/CreateCollectionDialog";
import { CreateResourceDialog } from "@/components/dashboard/CreateResourceDialog";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useDashboardPage } from "@/components/dashboard/hooks/useDashboardPage";
import { ResourceGrid } from "@/components/dashboard/ResourceGrid";
import { ResourceHeader } from "@/components/dashboard/ResourceHeader";
import { Container } from "@/components/shared/Container";

export default function DashboardPage() {
  const {
    isDialogOpen,
    setIsDialogOpen,
    openCreateCollectionDialog,
    isOpenDialogCreateResource,
    selectedCollectionId,
    selectedCollection,
    collections,
    resources,
    isLoadingResources,
    setSelectedCollectionId,
    searchQuery,
    setSearchQuery,
    openCreateResourceDialog,
    handleResourceDialogOpenChange,
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
          />
          <ResourceGrid
            resources={resources}
            isLoading={isLoadingResources}
          />
        </div>
      </div>

      <CreateResourceDialog
        open={isOpenDialogCreateResource}
        onOpenChange={handleResourceDialogOpenChange}
        defaultCollectionId={selectedCollectionId}
        collections={collections}
      	/>

      <CreateCollectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />


    </Container>
  );
}
