"use client";

import { useEffect, useState } from "react";
import { useCollections } from "../../../hook/collections/useCollections";
import { useResources } from "./useResources";

export function useDashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);

  const [isOpenDialogCreateResource, setIsOpenDialogCreateResource] =
    useState(false);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const { collections } = useCollections();

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
  };

  const openCreateCollectionDialog = () => setIsDialogOpen(true);
  const openCreateResourceDialog = () =>
    setIsOpenDialogCreateResource(!isOpenDialogCreateResource);

  return {
    // Collection dialog
    isDialogOpen,
    setIsDialogOpen,
    openCreateCollectionDialog,

    // Resource dialog
    isOpenDialogCreateResource,
    handleResourceDialogOpenChange,
    openCreateResourceDialog,
    selectedCollectionId,
    selectedCollection,
    collections,

    // Search
    searchQuery,
    setSearchQuery,
    resources: filteredResources,
    isLoadingResources,

    // Collection selection
    setSelectedCollectionId,
  };
}
