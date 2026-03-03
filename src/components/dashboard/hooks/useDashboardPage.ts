"use client";

import { useEffect, useState } from "react";
import type { UpdateResourceBody } from "@/types/resources";
import type {
  CreateResourcePayload,
  ResourceFromApi,
} from "../services/useResource";
import { useCategories } from "./useCategories";
import { useCategory } from "./useCategory";
import { useCollections } from "./useCollections";
import { useFetchMetadata } from "./useFetchMetadata";
import { useResourceMutations } from "./useResourceMutations";
import { useResources } from "./useResources";

export function useDashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);

  const [isOpenDialogCreateResource, setIsOpenDialogCreateResource] =
    useState(false);
  const [isOpenDialogEditResource, setIsOpenDialogEditResource] =
    useState(false);

  const [urlToFetch, setUrlToFetch] = useState<string | null>(null);
  const [resourceBeingEdited, setResourceBeingEdited] =
    useState<ResourceFromApi | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: metadata,
    isLoading: isFetchingMetadata,
    error: metadataError,
  } = useFetchMetadata(urlToFetch ?? "");

  const {
    collections,
    createCollection,
    isCreating,
    deleteCollection,
    isDeleting,
    isUpdating,
    updateCollection,
  } = useCollections();

  const { data: categories = [] } = useCategories();
  const { createCategory, isCreatingCategory } = useCategory();
  const {
    createResource,
    isCreating: isCreatingResource,
    deleteResource,
    isDeletingResource,
    updateResource,
    isUpdatingResource,
  } = useResourceMutations();
  const { data: resources = [], isLoading: isLoadingResources } =
    useResources(selectedCollectionId);

  const filteredResources =
    searchQuery.trim() === ""
      ? resources
      : resources.filter((resource) =>
          resource.title
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase()),
        );

  useEffect(() => {
    if (selectedCollectionId) setSearchQuery("");
  }, [selectedCollectionId]);

  useEffect(() => {
    if (collections.length > 0 && selectedCollectionId === null) {
      setSelectedCollectionId(collections[0].id);
    }
  }, [collections, selectedCollectionId]);

  const selectedCollection = collections.find(
    (c) => c.id === selectedCollectionId,
  );

  const handleResourceDialogOpenChange = (open: boolean) => {
    setIsOpenDialogCreateResource(open);
    if (!open) setUrlToFetch(null);
  };

  const handleEditResourceDialogOpenChange = (open: boolean) => {
    setIsOpenDialogEditResource(open);
    if (!open) setResourceBeingEdited(null);
  };

  const openEditResource = (resource: ResourceFromApi) => {
    setResourceBeingEdited(resource);
    setIsOpenDialogEditResource(true);
  };

  const closeEditResource = () => {
    setResourceBeingEdited(null);
    setIsOpenDialogEditResource(false);
  };

  const openCreateCollectionDialog = () => setIsDialogOpen(true);
  const openCreateResourceDialog = () =>
    setIsOpenDialogCreateResource(!isOpenDialogCreateResource);
  const onUpdateResource = (id: string, body: UpdateResourceBody) =>
    updateResource({ id, body });
  const onCreateResource = (payload: CreateResourcePayload) =>
    createResource(payload);

  return {
    // Collection dialog
    isDialogOpen,
    setIsDialogOpen,
    openCreateCollectionDialog,
    createCollection,
    isCreating,

    // Resource dialog
    isOpenDialogCreateResource,
    handleResourceDialogOpenChange,
    openCreateResourceDialog,
    urlToFetch,
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
    createResource: onCreateResource,
    isCreatingResource,
    deleteResource,
    isDeletingResource,
    updateResource: onUpdateResource,
    isUpdatingResource,
    resourceBeingEdited,
    isOpenDialogEditResource,
    openEditResource,
    closeEditResource,
    handleEditResourceDialogOpenChange,

    // Search
    searchQuery,
    setSearchQuery,
    resources: filteredResources,
    isLoadingResources,

    // Collection selection
    setSelectedCollectionId,

    // Collection functions
    deleteCollection,
    isDeleting,
    isUpdating,
    updateCollection,
  };
}
