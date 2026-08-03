"use client";

import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  FilterMailIcon,
  Search01Icon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/** Special tokens + user ids. Empty = todos. */
export type KanbanAssigneeToken = "unassigned" | "me" | (string & {});

export type KanbanBoardFiltersState = {
  query: string;
  assigneeIds: KanbanAssigneeToken[];
  /** Empty = all columns. Multiple ids = OR filter. */
  columnIds: string[];
};

export type KanbanFilterColumn = {
  id: string;
  name: string;
  color: string | null;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface Props {
  value: KanbanBoardFiltersState;
  onChange: (next: KanbanBoardFiltersState) => void;
  columns: KanbanFilterColumn[];
  matchCount: number;
  totalCount: number;
}

export function KanbanBoardToolbar({
  value,
  onChange,
  columns,
  matchCount,
  totalCount,
}: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const { data: membersQuery } = useWorkspaceMembers();
  const members = membersQuery?.data?.members ?? [];

  const selectionActive =
    value.assigneeIds.length > 0 || value.columnIds.length > 0;

  const hasActiveFilters =
    value.query.trim().length > 0 || selectionActive;

  const filterLabel = useMemo(() => {
    const parts: string[] = [];

    if (value.assigneeIds.length === 1) {
      const id = value.assigneeIds[0];
      if (id === "unassigned") parts.push("Sem responsável");
      else if (id === "me") parts.push("A mim");
      else {
        const member = members.find((m) => m.userId === id);
        parts.push(member?.user.name ?? "1 pessoa");
      }
    } else if (value.assigneeIds.length > 1) {
      parts.push(`${value.assigneeIds.length} pessoas`);
    }

    if (value.columnIds.length === 1) {
      const column = columns.find((c) => c.id === value.columnIds[0]);
      parts.push(column?.name ?? "1 coluna");
    } else if (value.columnIds.length > 1) {
      parts.push(`${value.columnIds.length} colunas`);
    }

    return parts.join(" · ");
  }, [columns, members, value.assigneeIds, value.columnIds]);

  function toggleAssignee(token: KanbanAssigneeToken) {
    const selected = value.assigneeIds.includes(token)
      ? value.assigneeIds.filter((id) => id !== token)
      : [...value.assigneeIds, token];
    onChange({ ...value, assigneeIds: selected });
  }

  function clearAssignees() {
    onChange({ ...value, assigneeIds: [] });
  }

  function toggleColumn(columnId: string) {
    const selected = value.columnIds.includes(columnId)
      ? value.columnIds.filter((id) => id !== columnId)
      : [...value.columnIds, columnId];
    onChange({ ...value, columnIds: selected });
  }

  function clearFilters() {
    onChange({ query: "", assigneeIds: [], columnIds: [] });
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 px-5 pt-4">
      <InputGroup className="h-9 max-w-md min-w-[240px] flex-1 rounded-xl">
        <InputGroupInput
          placeholder="Buscar cards..."
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
        />
        <InputGroupAddon align="inline-start">
          <Icon icon={Search01Icon} className="size-4" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end" className="gap-0.5">
          {value.query ? (
            <InputGroupButton
              size="icon-xs"
              aria-label="Limpar busca"
              onClick={() => onChange({ ...value, query: "" })}
            >
              <Icon icon={Cancel01Icon} className="size-3.5" />
            </InputGroupButton>
          ) : null}

          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger
              render={
                <InputGroupButton
                  size={filterLabel ? "xs" : "icon-xs"}
                  aria-label="Responsável e colunas"
                  className={cn("rounded-xl",
                    filterLabel && "max-w-40 px-1.5",
                    selectionActive && "text-foreground",
                  )}
                >
                  <Icon icon={FilterMailIcon} className="size-3.5 shrink-0" />
                  {filterLabel ? (
                    <span className="truncate">{filterLabel}</span>
                  ) : null}
                </InputGroupButton>
              }
            />
            <PopoverContent
              align="end"
              className="w-72 gap-0 rounded-2xl p-2"
            >
              <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Responsável
                <span className="ml-1 font-normal text-muted-foreground/80">
                  (múltiplos)
                </span>
              </p>

              <div className="flex flex-col gap-1">
              <FilterRow
                active={value.assigneeIds.length === 0}
                label="Todos"
                onSelect={clearAssignees}
                leading={
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted">
                    <Icon
                      icon={UserGroupIcon}
                      className="size-3.5 text-muted-foreground"
                    />
                  </span>
                }
              />
              <FilterRow
                active={value.assigneeIds.includes("me")}
                label="Atribuídos a mim"
                disabled={!session?.user.id}
                onSelect={() => toggleAssignee("me")}
                leading={
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted">
                    <Icon
                      icon={UserIcon}
                      className="size-3.5 text-muted-foreground"
                    />
                  </span>
                }
              />
              <FilterRow
                active={value.assigneeIds.includes("unassigned")}
                label="Sem responsável"
                onSelect={() => toggleAssignee("unassigned")}
                leading={
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted">
                    <Icon
                      icon={Cancel01Icon}
                      className="size-3 text-muted-foreground"
                    />
                  </span>
                }
              />

              {members.length > 0 ? (
                <div className="flex max-h-40 flex-col gap-1 overflow-y-auto scrollbar-none">
                  {members.map((member) => (
                    <FilterRow
                      key={member.userId}
                      active={value.assigneeIds.includes(member.userId)}
                      label={member.user.name}
                      onSelect={() => toggleAssignee(member.userId)}
                      leading={
                        <Avatar className="size-6 overflow-hidden ring-1 ring-border">
                          <AvatarImage
                            alt={member.user.name}
                            src={member.user.image ?? undefined}
                          />
                          <AvatarFallback className="text-[10px]">
                            {initials(member.user.name)}
                          </AvatarFallback>
                        </Avatar>
                      }
                    />
                  ))}
                </div>
              ) : null}
              </div>

              {columns.length > 0 ? (
                <>
                  <div className="my-1.5 h-px bg-border" />
                  <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Colunas
                    <span className="ml-1 font-normal text-muted-foreground/80">
                      (múltiplas)
                    </span>
                  </p>
                  <div className="flex max-h-40 flex-col gap-1 overflow-y-auto scrollbar-none">
                    {columns.map((column) => (
                      <FilterRow
                        key={column.id}
                        active={value.columnIds.includes(column.id)}
                        label={column.name}
                        onSelect={() => toggleColumn(column.id)}
                        leading={
                          <span
                            className="size-2.5 shrink-0 rounded-full ring-1 ring-border"
                            style={{
                              backgroundColor: column.color ?? "#94a3b8",
                            }}
                          />
                        }
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>

      {hasActiveFilters ? (
        <>
          <span className="text-xs text-muted-foreground tabular-nums">
            {matchCount} de {totalCount}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 rounded-xl text-muted-foreground"
            onClick={clearFilters}
          >
            Limpar
          </Button>
        </>
      ) : null}
    </div>
  );
}

function FilterRow({
  active,
  label,
  onSelect,
  leading,
  disabled,
}: {
  active: boolean;
  label: string;
  onSelect: () => void;
  leading?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm transition-colors",
        "hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
        active && "bg-muted",
      )}
    >
      <span className="flex size-6 shrink-0 items-center justify-center">
        {leading}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {active ? (
        <Icon
          icon={CheckmarkCircle02Icon}
          className="size-4 shrink-0 text-foreground"
        />
      ) : null}
    </button>
  );
}
