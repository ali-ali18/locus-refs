"use client";

import {
  MoreHorizontalCircle01Icon,
  PencilEdit01Icon,
  Trash2,
} from "@hugeicons/core-free-icons";
import type { KanbanColumn } from "@refstash/shared";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useDeleteKanbanColumn,
  useUpdateKanbanColumn,
} from "@/hook/kanban/useKanbanColumns";
import { cn } from "@/lib/utils";

const FALLBACK_COLOR = "#94a3b8";

const COLUMN_COLORS = [
  { value: "#ef4444", label: "Vermelho" },
  { value: "#f97316", label: "Laranja" },
  { value: "#eab308", label: "Amarelo" },
  { value: "#22c55e", label: "Verde" },
  { value: "#14b8a6", label: "Verde-água" },
  { value: "#3b82f6", label: "Azul" },
  { value: "#6366f1", label: "Índigo" },
  { value: "#a855f7", label: "Roxo" },
  { value: "#ec4899", label: "Rosa" },
  { value: "#94a3b8", label: "Ardósia" },
  { value: "#6b7280", label: "Cinza" },
] as const;

interface Props {
  boardId: string;
  column: KanbanColumn;
  cardCount: number;
  canDelete: boolean;
}

export function KanbanColumnMenu({
  boardId,
  column,
  cardCount,
  canDelete,
}: Props) {
  const updateColumn = useUpdateKanbanColumn(boardId);
  const deleteColumn = useDeleteKanbanColumn(boardId);

  const [renameOpen, setRenameOpen] = useState(false);
  const [draftName, setDraftName] = useState(column.name);

  useEffect(() => {
    if (renameOpen) setDraftName(column.name);
  }, [column.name, renameOpen]);

  async function handleRename() {
    const nextName = draftName.trim();
    if (!nextName) {
      toast.error("Nome é obrigatório");
      return;
    }
    if (nextName === column.name) {
      setRenameOpen(false);
      return;
    }
    try {
      await updateColumn.mutateAsync({
        columnId: column.id,
        name: nextName,
      });
      setRenameOpen(false);
      toast.success("Coluna renomeada");
    } catch {
      toast.error("Erro ao renomear coluna");
    }
  }

  async function handleColor(nextColor: string) {
    if (nextColor === (column.color ?? FALLBACK_COLOR)) return;
    try {
      await updateColumn.mutateAsync({
        columnId: column.id,
        color: nextColor,
      });
    } catch {
      toast.error("Erro ao atualizar cor");
    }
  }

  async function handleDelete() {
    if (!canDelete) {
      toast.error("O board precisa ter pelo menos uma coluna");
      return;
    }
    try {
      await deleteColumn.mutateAsync(column.id);
      toast.success(
        cardCount > 0
          ? `Coluna e ${cardCount} card(s) removidos`
          : "Coluna removida",
      );
    } catch {
      toast.error("Erro ao deletar coluna");
    }
  }

  const color = column.color ?? FALLBACK_COLOR;
  const colorLabel =
    COLUMN_COLORS.find((item) => item.value === color)?.label ?? "Cor";
  const busy = updateColumn.isPending || deleteColumn.isPending;

  return (
    <div className="relative shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              disabled={busy}
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Opções da coluna ${column.name}`}
            >
              <Icon icon={MoreHorizontalCircle01Icon} className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48 rounded-xl">
          <DropdownMenuItem
            className="rounded-xl"
            onClick={() => setRenameOpen(true)}
          >
            <Icon icon={PencilEdit01Icon} className="size-4" />
            Renomear
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="rounded-xl gap-2">
              <span
                className="size-3.5 shrink-0 rounded-full ring-1 ring-border"
                style={{ backgroundColor: color }}
              />
              <span className="flex-1 truncate">{colorLabel}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="min-w-40 rounded-xl p-1">
              {COLUMN_COLORS.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  className={cn(
                    "rounded-xl gap-2",
                    item.value === color && "bg-accent",
                  )}
                  onClick={() => void handleColor(item.value)}
                >
                  <span
                    className="size-3.5 shrink-0 rounded-full ring-1 ring-border"
                    style={{ backgroundColor: item.value }}
                  />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            className="rounded-xl"
            disabled={!canDelete || busy}
            onClick={() => void handleDelete()}
          >
            <Icon icon={Trash2} className="size-4" />
            {cardCount > 0 ? `Deletar (${cardCount})` : "Deletar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover open={renameOpen} onOpenChange={setRenameOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              className="pointer-events-none absolute inset-0"
            />
          }
        />
        <PopoverContent align="end" className="w-64 gap-2 rounded-xl p-3">
          <Input
            autoFocus
            value={draftName}
            disabled={updateColumn.isPending}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void handleRename();
              }
              if (e.key === "Escape") {
                setRenameOpen(false);
              }
            }}
            placeholder="Nome da coluna"
            className="h-8 rounded-xl"
          />
          <div className="flex justify-end gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setRenameOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={updateColumn.isPending}
              onClick={() => void handleRename()}
            >
              Salvar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
