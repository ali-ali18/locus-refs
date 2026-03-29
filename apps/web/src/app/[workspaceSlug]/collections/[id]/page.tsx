"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useWorkspace } from "@/context/workspace";
import { CreateResourceDialog } from "@/components/dashboard/CreateResourceDialog";
import { useResources } from "@/components/dashboard/hooks/useResources";
import { ResourceGrid } from "@/components/dashboard/ResourceGrid";
import { ResourceHeader } from "@/components/dashboard/ResourceHeader";
import { Container } from "@/components/shared/Container";
import { useCollectionCategories } from "@/hook/collections/useCollectionCategories";
import { useCollections } from "@/hook/collections/useCollections";

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workspaceSlug } = useWorkspace();

  const collectionId = params.id as string;
  const categorySlug = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateResourceOpen, setIsCreateResourceOpen] = useState(false);

  const { collections, isLoading: isLoadingCollections } = useCollections();
  const { data: resources = [], isLoading: isLoadingResources } =
    useResources(collectionId);
  const { data: categories = [] } = useCollectionCategories(collectionId);

  const collection = collections.find((c) => c.id === collectionId);
  const activeCategory = categories.find((cat) => cat.slug === categorySlug);

  useEffect(() => {
    if (!isLoadingCollections && collections.length > 0 && !collection) {
      router.push(`/${workspaceSlug}`);
    }
  }, [collection, isLoadingCollections, collections.length, router, workspaceSlug]);

  useEffect(() => {
    setSearchQuery("");
  }, [collectionId, categorySlug]);

  const filteredResources = resources.filter((r) => {
    const matchesCategory = categorySlug
      ? r.categories.some((cat) => cat.slug === categorySlug)
      : true;

    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : r.title.toLowerCase().includes(searchQuery.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <Container as="section" className="flex flex-col gap-8">
      <ResourceHeader
        title={
          activeCategory
            ? `${collection?.name ?? "..."} / ${activeCategory.name}`
            : (collection?.name ?? "...")
        }
        resourcesCount={filteredResources.length}
        handleOpenDialogCreateResource={() => setIsCreateResourceOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showCategoryFilter={categories.length > 0}
        categories={categories}
        activeCategorySlug={categorySlug}
        onCategoryChange={(slug) => {
          if (slug) {
            router.push(`/${workspaceSlug}/collections/${collectionId}?category=${slug}`);
          } else {
            router.push(`/${workspaceSlug}/collections/${collectionId}`);
          }
        }}
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
