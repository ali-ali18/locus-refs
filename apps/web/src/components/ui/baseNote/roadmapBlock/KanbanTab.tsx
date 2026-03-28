"use client";

import { XIcon } from "lucide-react";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/kibo-ui/kanban";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { RoadmapItem, RoadmapStatus } from "@/lib/extension/RoadmapBlock";
import { getInitials } from "./utils";

type KanbanTabProps = {
  items: RoadmapItem[];
  statuses: RoadmapStatus[];
  columns: { id: string; name: string }[];
  onDataChange: (data: RoadmapItem[]) => void;
  onDeleteItem: (id: string) => void;
};

export function KanbanTab({
  items,
  statuses,
  columns,
  onDataChange,
  onDeleteItem,
}: KanbanTabProps) {
  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-muted-foreground text-sm">
        Adicione itens para começar
      </p>
    );
  }

  return (
    <KanbanProvider
      className="flex gap-3"
      columns={columns}
      data={items}
      onDataChange={onDataChange}
    >
      {(column) => (
        <div className="min-w-0 flex-1" key={column.id}>
          <KanbanBoard id={column.id}>
            <KanbanHeader>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      statuses.find((s) => s.id === column.id)?.color ??
                      "#94a3b8",
                  }}
                />
                {column.name}
                <span className="ml-auto tabular-nums">
                  {items.filter((i) => i.column === column.id).length}
                </span>
              </div>
            </KanbanHeader>
            <KanbanCards className="min-h-24" id={column.id}>
              {(item: RoadmapItem) => {
                const status = statuses.find((s) => s.id === item.statusId);
                return (
                  <KanbanCard
                    key={item.id}
                    column={item.column}
                    id={item.id}
                    name={item.name}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-1">
                        <p className="flex-1 text-xs font-medium leading-snug">
                          {item.name}
                        </p>
                        <button
                          className="shrink-0 text-muted-foreground opacity-40 transition-opacity hover:opacity-100"
                          onClick={() => onDeleteItem(item.id)}
                          type="button"
                        >
                          <XIcon className="size-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        {status && (
                          <span className="flex items-center gap-1 text-muted-foreground text-xs">
                            <span
                              className="size-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: status.color }}
                            />
                            {status.name}
                          </span>
                        )}
                        {item.createdBy && (
                          <Avatar className="ml-auto size-5 overflow-hidden">
                            <AvatarImage
                              alt={item.createdBy.name}
                              src={item.createdBy.image}
                            />
                            <AvatarFallback className="text-[9px]">
                              {getInitials(item.createdBy.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </KanbanCard>
                );
              }}
            </KanbanCards>
          </KanbanBoard>
        </div>
      )}
    </KanbanProvider>
  );
}
