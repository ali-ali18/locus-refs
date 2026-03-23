"use client";

import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";
import { AddItemPopover } from "./AddItemPopover";
import { CalendarTab } from "./CalendarTab";
import { GanttTab } from "./GanttTab";
import { KanbanTab } from "./KanbanTab";
import { ListTab } from "./ListTab";
import { useRoadmapBlock } from "./hook/useRoadmapBlock";

export function RoadmapBlockView({ node, updateAttributes }: NodeViewProps) {
  const {
    items,
    statuses,
    kanbanColumns,
    ganttFeatures,
    addItem,
    deleteItem,
    handleKanbanDataChange,
    handleEditItem,
    handleListDragEnd,
  } = useRoadmapBlock({ node, updateAttributes });

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
            <div className="min-h-56">
              <CalendarTab features={ganttFeatures} />
            </div>
          </TabsContent>

          <TabsContent className="m-0" value="list">
            <div className="min-h-56 p-3">
              <ListTab
                items={items}
                statuses={statuses}
                onDeleteItemAction={deleteItem}
                onEditItemAction={handleEditItem}
                onDragEndAction={handleListDragEnd}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </NodeViewWrapper>
  );
}
