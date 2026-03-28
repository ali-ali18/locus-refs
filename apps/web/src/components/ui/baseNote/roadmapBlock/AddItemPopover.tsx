"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { RangePicker } from "@/components/base/RangePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authClient } from "@/lib/auth-client";
import type { RoadmapItem, RoadmapStatus } from "@/lib/extension/RoadmapBlock";
import { InputGroupApp } from "@/components/base";
import { Icon } from "@/components/shared/Icon";
import { Task01FreeIcons } from "@hugeicons/core-free-icons";

type AddItemPopoverProps = {
  statuses: RoadmapStatus[];
  onAdd: (item: RoadmapItem) => void;
};

export function AddItemPopover({ statuses, onAdd }: AddItemPopoverProps) {
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

  const handleAdd = () => {
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

    onAdd(newItem);
    setNewItemName("");
    setNewItemStatusId(statuses[0]?.id ?? "todo");
    setDateRange({
      from: new Date(),
      to: new Date(Date.now() + 30 * 86_400_000),
    });
    setPopoverOpen(false);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger
        className={"rounded-xl"}
        render={<Button className="h-7 w-7" size="icon" variant="outline" />}
      >
        <PlusIcon className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-xl" side="bottom">
        <div className="flex flex-col gap-3">
          <p className="font-medium text-sm">Nova tarefa</p>

          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs">Nome</span>
            <InputGroupApp
              firstElement={<Icon icon={Task01FreeIcons} />}
              autoFocus
              className="h-8 text-sm"
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Nome da tarefa..."
              value={newItemName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs">Status</span>
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
            onClick={handleAdd}
            size="default"
            rounded={"xl"}
          >
            Adicionar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
