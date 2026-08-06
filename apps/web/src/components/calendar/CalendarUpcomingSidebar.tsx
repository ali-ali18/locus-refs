"use client";

import {
  Cancel01Icon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import type { MouseEvent } from "react";
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
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar-event.type";
import { CalendarUpcomingCard } from "./CalendarUpcomingCard";
import { useCalendarUpcoming } from "./hook/useCalendarUpcoming";

function Section({
  title,
  icon,
  events,
  onEventClick,
}: {
  title: string;
  icon: typeof UserIcon;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent, e: MouseEvent) => void;
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-1.5 px-0.5 text-[12px] font-medium text-muted-foreground">
        <Icon icon={icon} className="size-3.5" />
        <span>{title}</span>
        <span className="tabular-nums text-muted-foreground/70">
          ({events.length})
        </span>
      </div>
      {events.length === 0 ? (
        <p className="px-0.5 text-[12px] text-muted-foreground/80">
          Nenhum evento
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {events.map((event) => (
            <CalendarUpcomingCard
              key={event.id}
              event={event}
              onClick={onEventClick}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent, e: MouseEvent) => void;
}

export function CalendarUpcomingSidebar({
  open,
  onOpenChange,
  events,
  onEventClick,
}: Props) {
  const isMobile = useIsMobile();
  const { personal, workspace } = useCalendarUpcoming(events);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerContent
        className={cn(
          "border-0 bg-background shadow-none",
        )}
      >
        <DrawerHeader className="flex-row! items-center justify-between gap-3 px-4 pt-3 pb-3 text-left!">
          <DrawerTitle>Próximos eventos</DrawerTitle>
          <DrawerClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
              />
            }
          >
            <Icon icon={Cancel01Icon} />
            <span className="sr-only">Fechar</span>
          </DrawerClose>
        </DrawerHeader>

        <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-col gap-5">
            <Section
              title="Pessoal"
              icon={UserIcon}
              events={personal}
              onEventClick={onEventClick}
            />
            <Section
              title="Workspace"
              icon={UserGroupIcon}
              events={workspace}
              onEventClick={onEventClick}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
