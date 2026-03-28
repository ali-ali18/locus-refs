"use client";

import type React from "react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { RangePicker } from "@/components/base/RangePicker";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import type { RoadmapItem, RoadmapStatus } from "@/lib/extension/RoadmapBlock";

type EditItemPopoverProps = {
  item: RoadmapItem;
  statuses: RoadmapStatus[];
  children: React.ReactElement;
  onSaveAction: (updated: RoadmapItem) => void;
};

export function EditItemPopover({
  item,
  statuses,
  children,
  onSaveAction,
}: EditItemPopoverProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(item.name);
  const [statusId, setStatusId] = useState(item.statusId);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(item.startAt),
    to: new Date(item.endAt),
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setName(item.name);
      setStatusId(item.statusId);
      setDateRange({
        from: new Date(item.startAt),
        to: new Date(item.endAt),
      });
    }
    setOpen(newOpen);
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSaveAction({
      ...item,
      name: trimmed,
      statusId,
      column: statusId,
      startAt: (dateRange?.from ?? new Date(item.startAt)).toISOString(),
      endAt: (dateRange?.to ?? new Date(item.endAt)).toISOString(),
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger render={children} />
      <PopoverContent className="w-80 gap-3 p-4 rounded-xl" align="end">
        <div className="flex flex-col gap-1.5">
          <span className="text-muted-foreground text-xs">Nome</span>
          <Textarea
            className="max-h-[4rem] rounded-xl resize-none overflow-hidden text-sm transition-[max-height] duration-150 hover:max-h-40 hover:overflow-auto"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
            }}
            placeholder="Nome da tarefa..."
            value={name}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-muted-foreground text-xs">Status</span>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((status) => (
              <Button
                variant={"outline"}
                size="sm"
                className="rounded-full"
                style={
                  statusId === status.id
                    ? {
                        backgroundColor:
                          "color-mix(in srgb, var(--color-secondary) 100%, transparent)",
                      }
                    : undefined
                }
                key={status.id}
                onClick={() => setStatusId(status.id)}
                type="button"
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                {status.name}
              </Button>
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

        <div className="flex gap-2">
          <Button
            className="h-8 flex-1"
            variant="outline"
            size="sm"
            rounded="xl"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            className="h-8 flex-1"
            disabled={!name.trim()}
            onClick={handleSave}
            size="sm"
            rounded="xl"
          >
            Salvar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
