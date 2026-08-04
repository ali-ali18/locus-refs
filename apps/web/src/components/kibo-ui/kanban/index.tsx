"use client";

import type {
  Announcements,
  DndContextProps,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import tunnel from "tunnel-rat";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const t = tunnel();

export type { DragEndEvent } from "@dnd-kit/core";

type KanbanItemProps = {
  id: string;
  name: string;
  column: string;
} & Record<string, unknown>;

type KanbanColumnProps = {
  id: string;
  name: string;
} & Record<string, unknown>;

type KanbanContextType<
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps,
> = {
  columns: C[];
  data: T[];
  activeCardId: string | null;
};

const KanbanContext = createContext<KanbanContextType>({
  columns: [],
  data: [],
  activeCardId: null,
});

const KanbanDataContext = createContext<KanbanItemProps[]>([]);

type ColumnHandleContextValue = {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
  setActivatorNodeRef: ReturnType<typeof useSortable>["setActivatorNodeRef"];
};

const ColumnHandleContext = createContext<ColumnHandleContextValue | null>(
  null,
);

function isColumnDrag(
  activeId: string | number,
  columns: KanbanColumnProps[],
  data: KanbanItemProps[],
  type?: string,
) {
  if (type === "column") return true;
  if (type === "card") return false;
  const id = String(activeId);
  if (data.some((item) => item.id === id)) return false;
  return columns.some((column) => column.id === id);
}

function resolveColumnId(
  overId: string | number,
  columns: KanbanColumnProps[],
  data: KanbanItemProps[],
): string | null {
  const id = String(overId);
  if (columns.some((column) => column.id === id)) return id;
  return data.find((item) => item.id === id)?.column ?? null;
}

export type KanbanColumnShellProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

/** Sortable wrapper for a column — drag via KanbanColumnHandle. */
export const KanbanColumnShell = ({
  id,
  children,
  className,
}: KanbanColumnShellProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transition,
    transform,
    isDragging,
    isOver,
  } = useSortable({
    id,
    data: { type: "column" },
  });

  const handle = useMemo(
    () => ({ attributes, listeners, setActivatorNodeRef }),
    [attributes, listeners, setActivatorNodeRef],
  );

  return (
    <ColumnHandleContext.Provider value={handle}>
      <div
        ref={setNodeRef}
        style={{
          transition,
          transform: CSS.Transform.toString(transform),
        }}
        className={cn(
          "flex flex-col",
          isDragging && "opacity-40",
          className,
        )}
      >
        <div
          className={cn(
            "flex size-full min-h-40 flex-col overflow-hidden rounded-2xl bg-muted/70 text-xs ring-2 transition-all",
            isOver && !isDragging ? "ring-primary/40" : "ring-transparent",
          )}
        >
          {children}
        </div>
      </div>
    </ColumnHandleContext.Provider>
  );
};

export type KanbanColumnHandleProps = HTMLAttributes<HTMLDivElement>;

export const KanbanColumnHandle = ({
  className,
  children,
  ...props
}: KanbanColumnHandleProps) => {
  const handle = useContext(ColumnHandleContext);

  if (!handle) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={handle.setActivatorNodeRef}
      className={cn("cursor-grab touch-none active:cursor-grabbing", className)}
      {...handle.listeners}
      {...handle.attributes}
      {...props}
    >
      {children}
    </div>
  );
};

export type KanbanBoardProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

/** Column body. Droppable for cards unless wrapped by KanbanColumnShell. */
export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  const columnHandle = useContext(ColumnHandleContext);
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: Boolean(columnHandle),
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex size-full min-h-0 flex-1 flex-col overflow-hidden",
        !columnHandle &&
          "min-h-40 rounded-2xl bg-muted/70 text-xs ring-2 transition-all",
        !columnHandle && (isOver ? "ring-primary/40" : "ring-transparent"),
        className,
      )}
    >
      {children}
    </div>
  );
};

export type KanbanCardProps<T extends KanbanItemProps = KanbanItemProps> = T & {
  children?: ReactNode;
  className?: string;
};

export const KanbanCard = <T extends KanbanItemProps = KanbanItemProps>({
  id,
  name,
  children,
  className,
}: KanbanCardProps<T>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id,
    data: { type: "card" },
  });
  const { activeCardId } = useContext(KanbanContext) as KanbanContextType;

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <div
        style={style}
        {...listeners}
        {...attributes}
        ref={setNodeRef}
        className="cursor-grab touch-none active:cursor-grabbing"
      >
        <Card
          className={cn(
            "cursor-grab gap-0 rounded-2xl border-0 bg-background p-3.5 shadow-none ring-1 ring-foreground/5 active:cursor-grabbing",
            isDragging && "pointer-events-none cursor-grabbing opacity-30",
            className,
          )}
        >
          {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
        </Card>
      </div>
      {activeCardId === id && (
        <t.In>
          <Card
            className={cn(
              "cursor-grab gap-0 rounded-2xl border-0 bg-background p-3.5 shadow-none ring-2 ring-primary/30",
              isDragging && "cursor-grabbing",
              className,
            )}
          >
            {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
          </Card>
        </t.In>
      )}
    </>
  );
};

export type KanbanCardsProps<T extends KanbanItemProps = KanbanItemProps> =
  Omit<HTMLAttributes<HTMLDivElement>, "children" | "id"> & {
    children: (item: T) => ReactNode;
    id: string;
  };

export const KanbanCards = <T extends KanbanItemProps = KanbanItemProps>({
  children,
  className,
  ...props
}: KanbanCardsProps<T>) => {
  const data = useContext(KanbanDataContext) as T[];
  const filteredData = data.filter((item) => item.column === props.id);
  const items = filteredData.map((item) => item.id);

  return (
    <ScrollArea className="overflow-hidden">
      <SortableContext items={items}>
        <div
          className={cn(
            "flex flex-grow flex-col gap-2.5 px-2.5 pb-1",
            className,
          )}
          {...props}
        >
          {filteredData.map(children)}
        </div>
      </SortableContext>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export type KanbanHeaderProps = HTMLAttributes<HTMLDivElement>;

export const KanbanHeader = ({ className, ...props }: KanbanHeaderProps) => (
  <div
    className={cn("m-0 px-3 pt-3 pb-2 font-semibold text-sm", className)}
    {...props}
  />
);

export type KanbanProviderProps<
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps,
> = Omit<DndContextProps, "children"> & {
  children: (column: C) => ReactNode;
  className?: string;
  columns: C[];
  data: T[];
  onDataChange?: (data: T[]) => void;
  onColumnsChange?: (columns: C[]) => void;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  trailing?: ReactNode;
};

export const KanbanProvider = <
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps,
>({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  className,
  columns,
  data,
  onDataChange,
  onColumnsChange,
  trailing,
  ...props
}: KanbanProviderProps<T, C>) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const columnIds = useMemo(() => columns.map((column) => column.id), [columns]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const card = data.find((item) => item.id === event.active.id);
    if (card) {
      setActiveCardId(event.active.id as string);
    }
    onDragStart?.(event);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      onDragOver?.(event);
      return;
    }

    const draggingColumn = isColumnDrag(
      active.id,
      columns,
      data,
      active.data.current?.type as string | undefined,
    );

    if (draggingColumn) {
      const overColumnId = resolveColumnId(over.id, columns, data);
      if (!overColumnId || active.id === overColumnId) {
        onDragOver?.(event);
        return;
      }

      const oldIndex = columns.findIndex((column) => column.id === active.id);
      const newIndex = columns.findIndex((column) => column.id === overColumnId);
      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        onColumnsChange?.(arrayMove(columns, oldIndex, newIndex));
      }
      onDragOver?.(event);
      return;
    }

    const activeItem = data.find((item) => item.id === active.id);
    const overItem = data.find((item) => item.id === over.id);

    if (!activeItem) {
      onDragOver?.(event);
      return;
    }

    const activeColumn = activeItem.column;
    const overColumn =
      overItem?.column ||
      columns.find((col) => col.id === over.id)?.id ||
      columns[0]?.id;

    if (activeColumn !== overColumn) {
      let newData = [...data];
      const activeIndex = newData.findIndex((item) => item.id === active.id);
      const overIndex = newData.findIndex((item) => item.id === over.id);

      newData[activeIndex].column = overColumn;
      newData = arrayMove(
        newData,
        activeIndex,
        overIndex >= 0 ? overIndex : activeIndex,
      );

      onDataChange?.(newData);
    }

    onDragOver?.(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCardId(null);
    onDragEnd?.(event);

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const draggingColumn = isColumnDrag(
      active.id,
      columns,
      data,
      active.data.current?.type as string | undefined,
    );

    if (draggingColumn) {
      const overColumnId = resolveColumnId(over.id, columns, data);
      if (!overColumnId) return;

      const oldIndex = columns.findIndex((column) => column.id === active.id);
      const newIndex = columns.findIndex((column) => column.id === overColumnId);
      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        onColumnsChange?.(arrayMove(columns, oldIndex, newIndex));
      }
      return;
    }

    let newData = [...data];
    const oldIndex = newData.findIndex((item) => item.id === active.id);
    const newIndex = newData.findIndex((item) => item.id === over.id);

    if (oldIndex < 0) return;
    if (newIndex < 0) return;

    newData = arrayMove(newData, oldIndex, newIndex);
    onDataChange?.(newData);
  };

  const announcements: Announcements = {
    onDragStart({ active }) {
      const item = data.find((item) => item.id === active.id);
      if (item) {
        return `Picked up the card "${item.name}" from the "${item.column}" column`;
      }
      const column = columns.find((col) => col.id === active.id);
      return column
        ? `Picked up the column "${column.name}"`
        : "Picked up item";
    },
    onDragOver({ active, over }) {
      const item = data.find((item) => item.id === active.id);
      if (item) {
        const newColumn =
          columns.find((column) => column.id === over?.id)?.name ?? "";
        return `Dragged the card "${item.name}" over the "${newColumn}" column`;
      }
      return "Dragging column";
    },
    onDragEnd({ active, over }) {
      const item = data.find((item) => item.id === active.id);
      if (item) {
        const newColumn =
          columns.find((column) => column.id === over?.id)?.name ?? "";
        return `Dropped the card "${item.name}" into the "${newColumn}" column`;
      }
      return "Dropped column";
    },
    onDragCancel({ active }) {
      const item = data.find((item) => item.id === active.id);
      if (item) {
        return `Cancelled dragging the card "${item.name}"`;
      }
      return "Cancelled dragging column";
    },
  };

  return (
    <KanbanContext.Provider value={{ columns, data, activeCardId }}>
      <KanbanDataContext.Provider value={data}>
        <DndContext
          accessibility={{ announcements }}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          sensors={sensors}
          {...props}
        >
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            <div
              className={cn(
                "grid size-full auto-cols-fr grid-flow-col gap-4",
                className,
              )}
            >
              {columns.map((column) => children(column))}
              {trailing}
            </div>
          </SortableContext>
          {typeof window !== "undefined" &&
            createPortal(
              <DragOverlay>
                <t.Out />
              </DragOverlay>,
              document.body,
            )}
        </DndContext>
      </KanbanDataContext.Provider>
    </KanbanContext.Provider>
  );
};
