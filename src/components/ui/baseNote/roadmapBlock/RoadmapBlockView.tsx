"use client";

import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { format } from "date-fns";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { RangePicker } from "@/components/base/RangePicker";
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarHeader,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from "@/components/kibo-ui/calendar";
import {
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from "@/components/kibo-ui/gantt";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/kibo-ui/kanban";
import {
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from "@/components/kibo-ui/list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import type { RoadmapItem, RoadmapStatus } from "@/lib/extension/RoadmapBlock";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function RoadmapBlockView({ node, updateAttributes }: NodeViewProps) {
  const items: RoadmapItem[] = JSON.parse(
    (node.attrs.items as string | undefined) ?? "[]",
  ) as unknown as RoadmapItem[];
  const statuses: RoadmapStatus[] = JSON.parse(
    (node.attrs.statuses as string | undefined) ?? "[]",
  );

  const { data: session } = authClient.useSession();
  const userName = (session?.user?.name as string | undefined) ?? "Usuário";
  const userImage = (session?.user?.image as string | undefined) ?? undefined;

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemStatusId, setNewItemStatusId] = useState(
    statuses[0]?.id ?? "todo",
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 30 * 86_400_000),
  });

  const getStatus = (statusId: string) =>
    statuses.find((s) => s.id === statusId) ?? statuses[0];

  const addItem = () => {
    const name = newItemName.trim();
    if (!name) return;

    const newItem: RoadmapItem = {
      id: crypto.randomUUID(),
      name,
      startAt: (dateRange?.from ?? new Date()).toISOString(),
      endAt: (
        dateRange?.to ?? new Date(Date.now() + 30 * 86_400_000)
      ).toISOString(),
      statusId: newItemStatusId,
      column: newItemStatusId,
      createdBy: { name: userName, image: userImage },
    };

    updateAttributes({ items: JSON.stringify([...items, newItem]) });
    setNewItemName("");
    setNewItemStatusId(statuses[0]?.id ?? "todo");
    setDateRange({
      from: new Date(),
      to: new Date(Date.now() + 30 * 86_400_000),
    });
    setPopoverOpen(false);
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

  const kanbanColumns = statuses.map((s) => ({ id: s.id, name: s.name }));

  const ganttFeatures = items.map((item) => ({
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

  return (
    <NodeViewWrapper contentEditable={false} className="my-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Tabs defaultValue="gantt">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <TabsList variant="line">
              <TabsTrigger value="gantt">Gantt</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="calendar">Calendário</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>

            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger
                render={
                  <Button className="h-7 w-7" size="icon" variant="outline" />
                }
              >
                <PlusIcon className="size-3.5" />
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-80 rounded-xl"
                side="bottom"
              >
                <div className="flex flex-col gap-3">
                  <p className="font-medium text-sm">Nova tarefa</p>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-muted-foreground text-xs">Nome</span>
                    <Input
                      autoFocus
                      className="h-8 text-sm"
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addItem()}
                      placeholder="Nome da tarefa..."
                      value={newItemName}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-muted-foreground text-xs">
                      Status
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {statuses.map((status) => (
                        <button
                          className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs transition-colors ${
                            newItemStatusId === status.id
                              ? "border-foreground bg-muted"
                              : "border-border hover:bg-muted/50"
                          }`}
                          key={status.id}
                          onClick={() => setNewItemStatusId(status.id)}
                          type="button"
                        >
                          <span
                            className="size-2 shrink-0 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          {status.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <RangePicker
                    label="Prazo"
                    numberOfMonths={1}
                    onChange={setDateRange}
                    placeholder="Selecione o prazo..."
                    value={dateRange}
                  />

                  <Button
                    className="h-8 w-full"
                    disabled={!newItemName.trim()}
                    onClick={addItem}
                    size="sm"
                  >
                    Adicionar
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* GANTT */}
          <TabsContent className="m-0" value="gantt">
            <div className="h-72">
              <GanttProvider className="h-full" range="monthly">
                <GanttSidebar className="min-w-56">
                  <GanttSidebarGroup name="Tarefas">
                    {ganttFeatures.map((feature) => (
                      <GanttSidebarItem
                        key={feature.id}
                        className="w-full"
                        feature={feature}
                      />
                    ))}
                  </GanttSidebarGroup>
                </GanttSidebar>
                <GanttTimeline>
                  <GanttHeader />
                  <GanttFeatureList>
                    <GanttFeatureListGroup>
                      <GanttFeatureRow
                        features={ganttFeatures}
                        onHover={(feature) => {
                          const item = items.find((i) => i.id === feature.id);
                          return (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className="size-2 shrink-0 rounded-full"
                                  style={{
                                    backgroundColor: feature.status.color,
                                  }}
                                />
                                <span className="font-medium">
                                  {feature.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                <span>{format(feature.startAt, "dd/MM")}</span>
                                <span>→</span>
                                <span>{format(feature.endAt, "dd/MM/yy")}</span>
                              </div>
                              {item?.createdBy && (
                                <div className="flex items-center gap-2">
                                  <Avatar className="size-5 overflow-hidden">
                                    <AvatarImage
                                      alt={item.createdBy.name}
                                      src={item.createdBy.image}
                                    />
                                    <AvatarFallback className="text-[9px]">
                                      {getInitials(item.createdBy.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-muted-foreground text-xs">
                                    {item.createdBy.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        }}
                      >
                        {(feature) => {
                          const item = items.find((i) => i.id === feature.id);
                          return (
                            <div className="flex h-full w-full items-center justify-between gap-1.5 px-2">
                              <p className="flex-1 truncate text-xs font-medium">
                                {feature.name}
                              </p>
                              {item?.createdBy && (
                                <Avatar className="size-4 shrink-0 overflow-hidden">
                                  <AvatarImage
                                    alt={item.createdBy.name}
                                    src={item.createdBy.image}
                                  />
                                  <AvatarFallback className="text-[8px]">
                                    {getInitials(item.createdBy.name)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          );
                        }}
                      </GanttFeatureRow>
                    </GanttFeatureListGroup>
                  </GanttFeatureList>
                  <GanttToday />
                </GanttTimeline>
              </GanttProvider>
            </div>
          </TabsContent>

          {/* KANBAN */}
          <TabsContent className="m-0" value="kanban">
            <div className="min-h-56 p-3">
              {items.length === 0 ? (
                <p className="py-10 text-center text-muted-foreground text-sm">
                  Adicione itens para começar
                </p>
              ) : (
                <KanbanProvider
                  className="flex gap-3"
                  columns={kanbanColumns}
                  data={items}
                  onDataChange={handleKanbanDataChange}
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
                                  statuses.find((s) => s.id === column.id)
                                    ?.color ?? "#94a3b8",
                              }}
                            />
                            {column.name}
                            <span className="ml-auto tabular-nums">
                              {
                                items.filter((i) => i.column === column.id)
                                  .length
                              }
                            </span>
                          </div>
                        </KanbanHeader>
                        <KanbanCards className="min-h-24" id={column.id}>
                          {(item: RoadmapItem) => {
                            const status = getStatus(item.statusId);
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
                                      onClick={() => deleteItem(item.id)}
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
                                          style={{
                                            backgroundColor: status.color,
                                          }}
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
              )}
            </div>
          </TabsContent>

          {/* CALENDAR */}
          <TabsContent className="m-0" value="calendar">
            <CalendarProvider className="min-h-48" locale="pt-BR" startDay={0}>
              <CalendarDate>
                <CalendarMonthPicker />
                <CalendarDatePagination />
                <CalendarYearPicker end={2030} start={2020} />
              </CalendarDate>
              <CalendarHeader />
              <CalendarBody features={ganttFeatures}>
                {({ feature }) => (
                  <div
                    key={feature.id}
                    className="truncate rounded-xl px-1.5 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: `${feature.status.color}25`,
                      color: feature.status.color,
                    }}
                  >
                    {feature.name}
                  </div>
                )}
              </CalendarBody>
            </CalendarProvider>
          </TabsContent>

          {/* LIST */}
          <TabsContent className="m-0" value="list">
            {items.length === 0 ? (
              <p className="py-10 text-center text-muted-foreground text-sm">
                Adicione itens para começar
              </p>
            ) : (
              <ListProvider
                onDragEnd={(event) => {
                  const { active, over } = event;
                  if (!over) return;
                  const activeData = active.data.current as {
                    index: number;
                    parent: string;
                  };
                  const newStatusId = over.id as string;
                  if (activeData.parent === newStatusId) return;
                  updateAttributes({
                    items: JSON.stringify(
                      items.map((item) =>
                        item.id === active.id
                          ? {
                              ...item,
                              statusId: newStatusId,
                              column: newStatusId,
                            }
                          : item,
                      ),
                    ),
                  });
                }}
              >
                {statuses.map((status) => {
                  const statusItems = items.filter(
                    (i) => i.statusId === status.id,
                  );
                  return (
                    <ListGroup key={status.id} id={status.id}>
                      <ListHeader
                        color={status.color}
                        name={`${status.name} (${statusItems.length})`}
                      />
                      <ListItems>
                        {statusItems.map((item, index) => (
                          <ListItem
                            key={item.id}
                            id={item.id}
                            index={index}
                            name={item.name}
                            parent={status.id}
                          >
                            <div className="flex flex-1 items-center justify-between gap-2">
                              <p className="text-xs font-medium">{item.name}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-xs">
                                  {format(new Date(item.startAt), "dd/MM")} →{" "}
                                  {format(new Date(item.endAt), "dd/MM/yy")}
                                </span>
                                {item.createdBy && (
                                  <Avatar className="size-5 overflow-hidden">
                                    <AvatarImage
                                      alt={item.createdBy.name}
                                      src={item.createdBy.image}
                                    />
                                    <AvatarFallback className="text-[9px]">
                                      {getInitials(item.createdBy.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <button
                                  className="text-muted-foreground opacity-40 transition-opacity hover:opacity-100"
                                  onClick={() => deleteItem(item.id)}
                                  type="button"
                                >
                                  <XIcon className="size-3" />
                                </button>
                              </div>
                            </div>
                          </ListItem>
                        ))}
                      </ListItems>
                    </ListGroup>
                  );
                })}
              </ListProvider>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </NodeViewWrapper>
  );
}
