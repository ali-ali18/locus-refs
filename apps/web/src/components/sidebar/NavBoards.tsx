"use client";

import {
  Add01Icon,
  DashboardSquare01Icon,
  LayoutGridIcon,
  MinusSignIcon,
  MoreHorizontalCircle01Icon,
  PencilEdit01Icon,
  Plus,
  Trash2,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { CreateBoardDialog } from "@/components/boards/CreateBoardDialog";
import { DeleteBoardDialog } from "@/components/boards/DeleteBoardDialog";
import { EditBoardDialog } from "@/components/boards/EditBoardDialog";
import { Icon } from "@/components/shared/Icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/components/workspace/overview/activity/formatRelativeTime";
import { resolveIcon } from "@/lib/icons";
import { useNavBoards } from "./hook/useNavBoards";

export function NavBoards() {
  const {
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
  } = useNavBoards();

  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {["a", "b", "c"].map((k) => (
          <Skeleton key={k} className="h-8 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Boards</SidebarGroupLabel>
        <SidebarGroupAction
          className="rounded-xl"
          onClick={() => setIsCreateOpen(true)}
          title="Criar novo board"
        >
          <Icon icon={Plus} />
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Nenhum board — clique em + para criar"
                onClick={() => setIsCreateOpen(true)}
                className="text-muted-foreground italic"
              >
                <Icon icon={LayoutGridIcon} />
                <span className="text-xs">Nenhum board</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
        <CreateBoardDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </SidebarGroup>
    );
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Boards</SidebarGroupLabel>
        <SidebarGroupAction
          className="rounded-xl"
          onClick={() => setIsCreateOpen(true)}
          title="Criar novo board"
        >
          <Icon icon={Plus} />
        </SidebarGroupAction>

        <SidebarGroupContent>
          <SidebarMenu>
            {boardSlice.map((board) => {
              const tooltipContent = board.lastOpenedAt
                ? `${board.title} · aberto ${formatRelativeTime(board.lastOpenedAt)}`
                : board.title;

              return (
                <SidebarMenuItem key={board.id}>
                  <SidebarMenuButton
                    tooltip={tooltipContent}
                    suppressHydrationWarning
                    isActive={isBoardActive(board.id)}
                    render={
                      <Link href={`/${workspaceSlug}/boards/${board.id}`} />
                    }
                  >
                    {board.icon ? (
                      <Icon icon={resolveIcon(board.icon)} />
                    ) : (
                      <Icon icon={DashboardSquare01Icon} />
                    )}
                    <span className="truncate">{board.title}</span>
                  </SidebarMenuButton>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      suppressHydrationWarning
                      render={
                        <SidebarMenuAction
                          showOnHover
                          className="aria-expanded:bg-sidebar-primary-foreground/30"
                        />
                      }
                    >
                      <Icon icon={MoreHorizontalCircle01Icon} />
                      <span className="sr-only">Mais opções</span>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    className="w-48 rounded-xl"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          setBoardToEdit({
                            id: board.id,
                            title: board.title,
                            icon: board.icon,
                            description: board.description,
                          })
                        }
                      >
                        <Icon icon={PencilEdit01Icon} />
                        <span>Renomear</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() =>
                          setBoardToDelete({
                            id: board.id,
                            title: board.title,
                          })
                        }
                      >
                        <Icon icon={Trash2} />
                        <span>Deletar</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            })}

            {boards.length > 3 && (
              <SidebarMenuButton
                onClick={() => setIsAllBoards(!isAllBoards)}
                tooltip={isAllBoards ? "Ver menos" : "Ver mais"}
              >
                {isAllBoards ? (
                  <>
                    <Icon icon={MinusSignIcon} />
                    Ver menos
                  </>
                ) : (
                  <>
                    <Icon icon={Add01Icon} />
                    Ver mais
                  </>
                )}
              </SidebarMenuButton>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <CreateBoardDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <EditBoardDialog
        open={boardToEdit !== null}
        onOpenChange={(open) => !open && setBoardToEdit(null)}
        boardId={boardToEdit?.id ?? ""}
        currentTitle={boardToEdit?.title ?? ""}
        currentIcon={boardToEdit?.icon ?? null}
        currentDescription={boardToEdit?.description ?? null}
      />

      <DeleteBoardDialog
        open={boardToDelete !== null}
        onOpenChange={(open) => !open && setBoardToDelete(null)}
        boardId={boardToDelete?.id ?? ""}
        boardTitle={boardToDelete?.title ?? ""}
        onConfirm={handleDelete}
      />
    </>
  );
}
