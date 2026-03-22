"use client";

import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import type { DragEndEvent } from "@/components/kibo-ui/list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RoadmapItem, RoadmapStatus } from "@/lib/extension/RoadmapBlock";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";
import { AddItemPopover } from "./AddItemPopover";
import { CalendarTab } from "./CalendarTab";
import { GanttTab } from "./GanttTab";
import { KanbanTab } from "./KanbanTab";
import { ListTab } from "./ListTab";
import type { GanttFeature } from "./utils";

export function RoadmapBlockView({ node, updateAttributes }: NodeViewProps) {
  const items: RoadmapItem[] = JSON.parse(
    (node.attrs.items as string | undefined) ?? "[]",
  ) as unknown as RoadmapItem[];
  const statuses: RoadmapStatus[] = JSON.parse(
    (node.attrs.statuses as string | undefined) ?? "[]",
  );

  const getStatus = (statusId: string) =>
    statuses.find((s) => s.id === statusId) ?? statuses[0];

  const kanbanColumns = statuses.map((s) => ({ id: s.id, name: s.name }));

  const ganttFeatures: GanttFeature[] = items.map((item) => ({
    id: item.id,
    name: item.name,
    startAt: new Date(item.startAt),
    endAt: new Date(item.endAt),
    status: getStatus(item.statusId) ?? {
      id: "todo",
      name: "A fazer",
      color: "#94a3b8",
    },
  }));

  const addItem = (item: RoadmapItem) => {
    updateAttributes({ items: JSON.stringify([...items, item]) });
  };

  const deleteItem = (id: string) => {
    updateAttributes({
      items: JSON.stringify(items.filter((i) => i.id !== id)),
    });
  };

  const handleKanbanDataChange = (newData: RoadmapItem[]) => {
    const synced = newData.map((item) => ({ ...item, statusId: item.column }));
    updateAttributes({ items: JSON.stringify(synced) });
  };

  const handleEditItem = (updated: RoadmapItem) => {
    updateAttributes({
      items: JSON.stringify(
        items.map((i) => (i.id === updated.id ? updated : i)),
      ),
    });
  };

  const handleListDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeData = active.data.current as { index: number; parent: string };
    const newStatusId = over.id as string;
    if (activeData.parent === newStatusId) return;
    updateAttributes({
      items: JSON.stringify(
        items.map((item) =>
          item.id === active.id
            ? { ...item, statusId: newStatusId, column: newStatusId }
            : item,
        ),
      ),
    });
  };

  return (
    <NodeViewWrapper contentEditable={false} className="my-4">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Tabs defaultValue="gantt" className={"gap-0"}>
          <div className="flex items-center justify-between border-b px-3 py-1">
            <TabsList variant="line">
              <TabsTrigger value="gantt">Gantt</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="calendar">Calendário</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
            <Tooltip>
              <TooltipTrigger
                render={<AddItemPopover statuses={statuses} onAdd={addItem} />}
                />
              <TooltipContent side="top">
                <p>Criar uma nova tarefa</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <TabsContent className="m-0" value="gantt">
            <GanttTab features={ganttFeatures} items={items} />
          </TabsContent>

          <TabsContent className="m-0" value="kanban">
            <div className="min-h-56 p-3">
              <KanbanTab
                columns={kanbanColumns}
                items={items}
                statuses={statuses}
                onDataChange={handleKanbanDataChange}
                onDeleteItem={deleteItem}
              />
            </div>
          </TabsContent>

          <TabsContent className="m-0" value="calendar">
            <CalendarTab features={ganttFeatures} />
          </TabsContent>

          <TabsContent className="m-0" value="list">
            <ListTab
              items={items}
              statuses={statuses}
              onDeleteItemAction={deleteItem}
              onEditItemAction={handleEditItem}
              onDragEndAction={handleListDragEnd}
            />
          </TabsContent>
        </Tabs>
      </div>
    </NodeViewWrapper>
  );
}
