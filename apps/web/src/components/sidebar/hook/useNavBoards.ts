"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useWorkspace } from "@/context/workspace";
import { useBoards, useDeleteBoard } from "@/hook/boards/useBoards";

export function useNavBoards() {
  const { data: boards = [], isLoading } = useBoards();
  const deleteBoard = useDeleteBoard();
  const { workspaceSlug } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAllBoards, setIsAllBoards] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState<{
    id: string;
    title: string;
    icon?: string | null;
    description?: string | null;
  } | null>(null);
  const [boardToDelete, setBoardToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Slice: mostra só 3 inicialmente, "Ver mais" expande
  const boardSlice = isAllBoards ? boards : boards.slice(0, 3);

  const isBoardActive = (id: string) =>
    pathname === `/${workspaceSlug}/boards/${id}` ||
    pathname.startsWith(`/${workspaceSlug}/boards/${id}/`);

  const handleDelete = async (id: string) => {
    if (pathname === `/${workspaceSlug}/boards/${id}`) {
      router.push(`/${workspaceSlug}/boards`);
    }
    await deleteBoard.mutateAsync(id);
  };

  return {
    boards,
    boardSlice,
    isLoading,
    isAllBoards,
    setIsAllBoards,
    isBoardActive,
    isCreateOpen,
    setIsCreateOpen,
    boardToEdit,
    setBoardToEdit,
    boardToDelete,
    setBoardToDelete,
    handleDelete,
    workspaceSlug,
  };
}
