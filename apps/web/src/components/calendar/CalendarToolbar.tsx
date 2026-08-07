"use client";

import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  LeftToRightListDashIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type CalendarViewMode,
  type CalendarVisibilityFilter,
  VIEW_LABELS,
} from "./calendar-utils";

interface Props {
  isMobile: boolean;
  titleLabel: string;
  navLabel: string;
  visibility: CalendarVisibilityFilter;
  viewMenuValue: CalendarViewMode;
  onVisibilityChange: (value: CalendarVisibilityFilter) => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onShift: (delta: number) => void;
  onToday: () => void;
  onOpenUpcoming: () => void;
}

export function CalendarToolbar({
  isMobile,
  titleLabel,
  navLabel,
  visibility,
  viewMenuValue,
  onVisibilityChange,
  onViewModeChange,
  onShift,
  onToday,
  onOpenUpcoming,
}: Props) {
  return (
    <div className="flex shrink-0 flex-col gap-3 px-3 sm:gap-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <h1 className="min-w-0 truncate text-lg font-semibold tracking-tight text-foreground capitalize sm:text-2xl">
          {titleLabel}
        </h1>
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => onShift(-1)}
            aria-label={`${navLabel} anterior`}
          >
            <Icon icon={ArrowLeft01Icon} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => onShift(1)}
            aria-label={`Próximo ${navLabel}`}
          >
            <Icon icon={ArrowRight01Icon} />
          </Button>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:gap-2">
        <Tabs
          value={visibility}
          onValueChange={(v) =>
            onVisibilityChange(v as CalendarVisibilityFilter)
          }
          className="w-full lg:w-auto"
        >
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="all" className="flex-1 lg:flex-none">
              Todos
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex-1 lg:flex-none">
              Pessoal
            </TabsTrigger>
            <TabsTrigger value="workspace" className="flex-1 lg:flex-none">
              {isMobile ? "WS" : "Workspace"}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button type="button" variant="outline" className="shrink-0">
                  {VIEW_LABELS[viewMenuValue]}
                  <Icon
                    icon={ArrowDown01Icon}
                    className="opacity-60"
                    data-icon="inline-end"
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-36 rounded-xl">
              {isMobile ? (
                <DropdownMenuItem
                  className="rounded-xl"
                  onClick={() => onViewModeChange("day")}
                >
                  Dia
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="rounded-xl"
                  onClick={() => onViewModeChange("week")}
                >
                  Semana
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="rounded-xl"
                onClick={() => onViewModeChange("month")}
              >
                Mês
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="outline"
            className="shrink-0"
            onClick={onToday}
          >
            Hoje
          </Button>

          <Button
            type="button"
            size="icon"
            variant="outline"
            className="shrink-0"
            aria-label="Próximos eventos"
            onClick={onOpenUpcoming}
          >
            <Icon icon={LeftToRightListDashIcon} />
          </Button>
        </div>
      </div>
    </div>
  );
}
