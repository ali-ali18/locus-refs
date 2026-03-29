"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useWorkspace } from "@/context/workspace";
import { useCollections } from "@/hook/collections/useCollections";

export function useNavMain() {
  const { collections, isLoading, deleteCollection } = useCollections();
  const { workspaceSlug } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAllCollections, setIsAllCollections] = useState(false);
  const [collectionToEdit, setCollectionToEdit] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [openCollections, setOpenCollections] = useState<Set<string>>(
    new Set(),
  );

  const collectionSlice = isAllCollections
    ? collections
    : collections.slice(0, 3);

  const activeCategorySlug = searchParams.get("category");

  const toggleCollection = (id: string) => {
    setOpenCollections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async (id: string) => {
    if (pathname === `/${workspaceSlug}/collections/${id}`) {
      router.push(`/${workspaceSlug}`);
    }
    await deleteCollection(id);
  };

  const handleCategoryClick = (collectionId: string, categorySlug: string) => {
    router.push(
      `/${workspaceSlug}/collections/${collectionId}?category=${categorySlug}`,
    );
  };

  const isCollectionActive = (id: string) =>
    pathname === `/${workspaceSlug}/collections/${id}` ||
    (pathname.startsWith(`/${workspaceSlug}/collections/${id}`) &&
      !!activeCategorySlug);

  return {
    collections,
    collectionSlice,
    isLoading,
    activeCategorySlug,
    openCollections,
    toggleCollection,
    isCollectionActive,
    isCreateOpen,
    setIsCreateOpen,
    isAllCollections,
    setIsAllCollections,
    collectionToEdit,
    setCollectionToEdit,
    handleDelete,
    handleCategoryClick,
    workspaceSlug,
  };
}
