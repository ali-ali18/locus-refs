"use client";

import { Edit, Trash2 } from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import {
  type DragEndEvent,
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from "@/components/kibo-ui/list";
import { Icon } from "@/components/shared/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { RoadmapItem, RoadmapStatus } from "@/lib/extension/RoadmapBlock";
import { EditItemPopover } from "./EditItemPopover";
import { getInitials } from "./utils";

type ListTabProps = {
  items: RoadmapItem[];
  statuses: RoadmapStatus[];
  onDeleteItemAction: (id: string) => void;
  onEditItemAction: (item: RoadmapItem) => void;
  onDragEndAction: (event: DragEndEvent) => void;
};

type ListItemRowProps = {
  item: RoadmapItem;
  index: number;
  statusId: string;
  statuses: RoadmapStatus[];
  onDeleteItemAction: (id: string) => void;
  onEditItemAction: (item: RoadmapItem) => void;
};

function ListItemRow({
  item,
  index,
  statusId,
  statuses,
  onDeleteItemAction,
  onEditItemAction,
}: ListItemRowProps) {
  return (
    <ListItem
      key={item.id}
      id={item.id}
      index={index}
      name={item.name}
      parent={statusId}
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
          <div className="flex items-center gap-1">
            <EditItemPopover
              item={item}
              statuses={statuses}
              onSaveAction={onEditItemAction}
            >
              <Button
                className="size-7 p-0"
                size="icon"
                variant="ghost"
                rounded={"xl"}
              >
                <Icon icon={Edit} />
              </Button>
            </EditItemPopover>
            <Button
              className="size-7 p-0 text-destructive hover:text-destructive"
              size="icon"
              variant="ghost"
              rounded={"xl"}
              onClick={() => onDeleteItemAction(item.id)}
            >
              <Icon icon={Trash2} />
            </Button>
          </div>
        </div>
      </div>
    </ListItem>
  );
}

export function ListTab({
  items,
  statuses,
  onDeleteItemAction,
  onEditItemAction,
  onDragEndAction,
}: ListTabProps) {
  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-muted-foreground text-sm">
        Adicione itens para começar
      </p>
    );
  }

  return (
    <ListProvider onDragEnd={onDragEndAction}>
      {statuses.map((status) => {
        const statusItems = items.filter((i) => i.statusId === status.id);
        return (
          <ListGroup key={status.id} id={status.id}>
            <ListHeader
              color={status.color}
              name={`${status.name} (${statusItems.length})`}
            />
            <ListItems>
              {statusItems.map((item, index) => (
                <ListItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  statusId={status.id}
                  statuses={statuses}
                  onDeleteItemAction={onDeleteItemAction}
                  onEditItemAction={onEditItemAction}
                />
              ))}
            </ListItems>
          </ListGroup>
        );
      })}
    </ListProvider>
  );
}
