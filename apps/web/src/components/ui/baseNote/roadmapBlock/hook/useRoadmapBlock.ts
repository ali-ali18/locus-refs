import type { NodeViewProps } from "@tiptap/react";
import type { DragEndEvent } from "@/components/kibo-ui/list";
import type { RoadmapItem, RoadmapStatus } from "@/lib/extension/RoadmapBlock";
import type { GanttFeature } from "../utils";

type UseRoadmapBlockProps = Pick<NodeViewProps, "node" | "updateAttributes">;

export function useRoadmapBlock({
  node,
  updateAttributes,
}: UseRoadmapBlockProps) {
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

  return {
    items,
    statuses,
    kanbanColumns,
    ganttFeatures,
    addItem,
    deleteItem,
    handleKanbanDataChange,
    handleEditItem,
    handleListDragEnd,
  };
}
