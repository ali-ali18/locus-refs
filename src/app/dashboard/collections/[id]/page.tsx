"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateResourceDialog } from "@/components/dashboard/CreateResourceDialog";
import { useResources } from "@/components/dashboard/hooks/useResources";
import { ResourceGrid } from "@/components/dashboard/ResourceGrid";
import { ResourceHeader } from "@/components/dashboard/ResourceHeader";
import { Container } from "@/components/shared/Container";
import { useCollections } from "@/hook/collections/useCollections";

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateResourceOpen, setIsCreateResourceOpen] = useState(false);

  const { collections, isLoading: isLoadingCollections } = useCollections();
  const { data: resources = [], isLoading: isLoadingResources } =
    useResources(collectionId);

  const collection = collections.find((c) => c.id === collectionId);

  useEffect(() => {
    if (!isLoadingCollections && collections.length > 0 && !collection) {
      router.push("/dashboard");
    }
  }, [collection, isLoadingCollections, collections.length, router]);

  useEffect(() => {
    setSearchQuery("");
  }, [collectionId]);

  const filteredResources =
    searchQuery.trim() === ""
      ? resources
      : resources.filter((r) =>
          r.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
        );

  return (
    <Container as="section" className="flex flex-col gap-8">
      <ResourceHeader
        title={collection?.name ?? "..."}
        resourcesCount={filteredResources.length}
        handleOpenDialogCreateResource={() => setIsCreateResourceOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ResourceGrid
        resources={filteredResources}
        isLoading={isLoadingResources}
      />

      <CreateResourceDialog
        open={isCreateResourceOpen}
        onOpenChange={setIsCreateResourceOpen}
        defaultCollectionId={collectionId}
        collections={collections}
      />
    </Container>
  );
}
