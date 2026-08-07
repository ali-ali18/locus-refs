"use client";

import { Cancel01Icon, Plus } from "@hugeicons/core-free-icons";
import { ptBR } from "date-fns/locale";
import { useRef, type MouseEvent } from "react";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hook/use-mobile";
import type { CalendarEvent } from "@/types/calendar-event.type";
import { CalendarUpcomingCard } from "./CalendarUpcomingCard";
import { format, formatHour } from "./calendar-utils";
import type { CalendarSlotSheet } from "./hook/useContentCalendar";

export type { CalendarSlotSheet };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sheet: CalendarSlotSheet | null;
  onEventClick: (event: CalendarEvent, e: MouseEvent) => void;
  onAddEvent: (e: MouseEvent) => void;
}

export function CalendarSlotEventsDrawer({
  open,
  onOpenChange,
  sheet,
  onEventClick,
  onAddEvent,
}: Props) {
  const isMobile = useIsMobile();
  // Cache: se limpar o sheet no close, o Drawer some sem animar a saída.
  const cachedSheet = useRef(sheet);
  if (sheet) cachedSheet.current = sheet;
  const data = sheet ?? cachedSheet.current;

  const title = data
    ? `${format(data.day, "EEE d MMM", { locale: ptBR })} · ${formatHour(data.hour)}`
    : "";

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerContent>
        <DrawerHeader className="flex-row! items-center justify-between gap-3 px-4 pt-3 pb-3 text-left!">
          <DrawerTitle className="capitalize">{title}</DrawerTitle>
          <DrawerClose
            render={<Button variant="ghost" size="icon-sm" />}
          >
            <Icon icon={Cancel01Icon} />
            <span className="sr-only">Fechar</span>
          </DrawerClose>
        </DrawerHeader>

        <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-col gap-2">
            {(data?.events ?? []).map((event) => (
              <CalendarUpcomingCard
                key={event.id}
                event={event}
                onClick={onEventClick}
              />
            ))}

            <Button
              type="button"
              variant="ghost"
              className="mt-2 w-full"
              onClick={onAddEvent}
            >
              <Icon icon={Plus} /> Adicionar nova tarefa
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
