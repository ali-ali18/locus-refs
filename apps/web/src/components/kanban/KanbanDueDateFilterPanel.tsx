"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useIsMobile } from "@/hook/use-mobile";
import {
  EMPTY_KANBAN_DUE_FILTER,
  formatDueFilterLabel,
  kanbanDueDateToLocalDate,
  localDateToKanbanDueDate,
  rangeForDueFilterPreset,
  rangeForMonth,
  type KanbanDueFilterPreset,
  type KanbanDueFilterState,
} from "@/lib/kanban/due-date";
import { cn } from "@/lib/utils";

const PRESETS: Array<{
  id: Exclude<KanbanDueFilterPreset, "month" | "custom"> | "month" | "custom";
  label: string;
}> = [
  { id: "today", label: "Hoje" },
  { id: "this_week", label: "Esta semana" },
  { id: "this_month", label: "Este mês" },
  { id: "last_month", label: "Mês passado" },
  { id: "month", label: "Selecionar mês" },
  { id: "custom", label: "Período customizado" },
];

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

interface Props {
  value: KanbanDueFilterState;
  onChange: (next: KanbanDueFilterState) => void;
}

export function KanbanDueDateFilterPanel({ value, onChange }: Props) {
  const isMobile = useIsMobile();
  const [panel, setPanel] = useState<"calendar" | "months">(
    value.preset === "month" ? "months" : "calendar",
  );
  const [monthYear, setMonthYear] = useState(() => {
    const from = kanbanDueDateToLocalDate(value.from);
    return from?.getFullYear() ?? new Date().getFullYear();
  });

  const selected: DateRange | undefined =
    value.from || value.to
      ? {
          from: kanbanDueDateToLocalDate(value.from ?? value.to),
          to: kanbanDueDateToLocalDate(value.to ?? value.from),
        }
      : undefined;

  const selectedMonthIndex = useMemo(() => {
    if (value.preset !== "month" || !value.from) return null;
    return kanbanDueDateToLocalDate(value.from)?.getMonth() ?? null;
  }, [value.from, value.preset]);

  function applyPreset(
    preset: Exclude<KanbanDueFilterPreset, "custom" | "month">,
  ) {
    const range = rangeForDueFilterPreset(preset);
    setPanel("calendar");
    onChange({ preset, from: range.from, to: range.to });
  }

  function applyMonth(monthIndex: number) {
    const range = rangeForMonth(monthYear, monthIndex);
    onChange({ preset: "month", from: range.from, to: range.to });
  }

  function handleCustomSelect(range: DateRange | undefined) {
    if (!range?.from) {
      onChange(EMPTY_KANBAN_DUE_FILTER);
      return;
    }

    const from = localDateToKanbanDueDate(range.from);
    const to = range.to ? localDateToKanbanDueDate(range.to) : from;
    onChange({
      preset: "custom",
      from,
      to,
    });
  }

  function handlePresetClick(id: (typeof PRESETS)[number]["id"]) {
    if (id === "custom") {
      setPanel("calendar");
      onChange({
        preset: "custom",
        from: value.from,
        to: value.to,
      });
      return;
    }
    if (id === "month") {
      setPanel("months");
      onChange({
        preset: "month",
        from: value.preset === "month" ? value.from : null,
        to: value.preset === "month" ? value.to : null,
      });
      return;
    }
    applyPreset(id);
  }

  function clearFilter() {
    setPanel("calendar");
    onChange(EMPTY_KANBAN_DUE_FILTER);
  }

  const calendar = (
    <Calendar
      mode="range"
      locale={ptBR}
      numberOfMonths={1}
      defaultMonth={selected?.from}
      selected={selected}
      onSelect={handleCustomSelect}
      data-range-complete={
        selected?.from &&
        selected.to &&
        selected.from.getTime() !== selected.to.getTime()
          ? "true"
          : undefined
      }
    />
  );

  if (isMobile) {
    return (
      <div className="flex flex-col">
        {calendar}
        {value.preset ? (
          <div className="border-t border-border p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full rounded-xl text-muted-foreground"
              onClick={clearFilter}
            >
              Limpar prazo
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex min-w-0">
      <div className="flex w-44 shrink-0 flex-col gap-1 border-r border-border p-2">
        <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Prazo
        </p>
        {PRESETS.map((preset) => {
          const active = value.preset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetClick(preset.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm transition-colors",
                "hover:bg-muted",
                active && "bg-muted",
              )}
            >
              <span className="min-w-0 flex-1 truncate">{preset.label}</span>
              {active ? (
                <Icon
                  icon={CheckmarkCircle02Icon}
                  className="size-4 shrink-0 text-foreground"
                />
              ) : null}
            </button>
          );
        })}

        {value.preset ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-1 w-full justify-start rounded-xl text-muted-foreground"
            onClick={clearFilter}
          >
            Limpar prazo
          </Button>
        ) : null}

        {formatDueFilterLabel(value) ? (
          <p className="mt-auto px-2 pt-2 text-[11px] text-muted-foreground first-letter:uppercase">
            {formatDueFilterLabel(value)}
          </p>
        ) : null}
      </div>

      <div className="p-2">
        {panel === "months" ? (
          <div className="flex w-[252px] flex-col gap-3 p-2">
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-xl"
                onClick={() => setMonthYear((year) => year - 1)}
                aria-label="Ano anterior"
              >
                <Icon icon={ArrowLeft01Icon} className="size-4" />
              </Button>
              <span className="text-sm font-medium tabular-nums">
                {monthYear}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-xl"
                onClick={() => setMonthYear((year) => year + 1)}
                aria-label="Próximo ano"
              >
                <Icon icon={ArrowRight01Icon} className="size-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {MONTH_LABELS.map((label, monthIndex) => {
                const active =
                  selectedMonthIndex === monthIndex &&
                  value.preset === "month" &&
                  Boolean(value.from) &&
                  kanbanDueDateToLocalDate(value.from)?.getFullYear() ===
                    monthYear;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => applyMonth(monthIndex)}
                    className={cn(
                      "rounded-xl px-2 py-2 text-sm transition-colors hover:bg-muted",
                      active &&
                        "bg-primary text-primary-foreground hover:bg-primary",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          calendar
        )}
      </div>
    </div>
  );
}
