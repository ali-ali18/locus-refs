"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  formatKanbanDueDateLabel,
  kanbanDueDateToLocalDate,
  localDateToKanbanDueDate,
  type KanbanDueDateRange,
} from "@/lib/kanban/due-date";
import { cn } from "@/lib/utils";

interface Props {
  value: KanbanDueDateRange;
  onChange: (value: KanbanDueDateRange) => void;
  disabled?: boolean;
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function toDateRange(value: KanbanDueDateRange): DateRange | undefined {
  if (!value.startDate && !value.dueDate) return undefined;
  const from = kanbanDueDateToLocalDate(value.startDate ?? value.dueDate);
  const to = kanbanDueDateToLocalDate(value.dueDate ?? value.startDate);
  if (!from) return undefined;
  return { from, to };
}

/** Empty value → start at today so the user only picks the end date. */
function resolveOpenRange(value: KanbanDueDateRange): DateRange {
  return toDateRange(value) ?? { from: startOfToday(), to: undefined };
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function KanbanDueDatePicker({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() =>
    toDateRange(value),
  );

  useEffect(() => {
    if (!open) setDateRange(toDateRange(value));
  }, [open, value]);

  const label = formatKanbanDueDateLabel(value.startDate, value.dueDate);
  const rangeComplete = Boolean(
    dateRange?.from &&
      dateRange.to &&
      !isSameDay(dateRange.from, dateRange.to),
  );

  function commit(range: DateRange | undefined) {
    if (!range?.from) {
      onChange({ startDate: null, dueDate: null });
      return;
    }

    onChange({
      startDate: localDateToKanbanDueDate(range.from),
      dueDate: localDateToKanbanDueDate(range.to ?? range.from),
    });
  }

  function handleSelect(range: DateRange | undefined) {
    setDateRange(range);

    // Complete only when end differs from start (user picked `to`).
    if (range?.from && range.to && !isSameDay(range.from, range.to)) {
      commit(range);
      setOpen(false);
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setDateRange(resolveOpenRange(value));
      return;
    }
    commit(dateRange);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            id="kanban-card-due-date"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-10 w-full justify-start rounded-xl px-3 font-normal",
              !label && "text-muted-foreground",
            )}
          >
            <Icon icon={Calendar03Icon} className="size-4 shrink-0" />
            <span className="truncate">{label ?? "Sem prazo"}</span>
          </Button>
        }
      />
      <PopoverContent className="w-auto rounded-xl p-0" align="start">
        <Calendar
          mode="range"
          locale={ptBR}
          defaultMonth={dateRange?.from ?? startOfToday()}
          selected={dateRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          data-range-complete={rangeComplete ? "true" : undefined}
        />
        <div className="border-t border-border p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full rounded-xl"
            onClick={() => {
              setDateRange(undefined);
              onChange({ startDate: null, dueDate: null });
              setOpen(false);
            }}
          >
            Sem prazo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
