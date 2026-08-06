"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { CalendarEvent } from "@/types/calendar-event.type";
import { CalendarEventForm } from "./CalendarEventForm";
import { useCalendarEventDialog } from "./hook/useCalendarEventDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CalendarEvent | null;
  defaultStartAt?: Date;
  defaultEndAt?: Date;
  defaultAllDay?: boolean;
  anchorPoint?: { x: number; y: number } | null;
}

export function CalendarEventDialog({
  open,
  onOpenChange,
  event,
  defaultStartAt,
  defaultEndAt,
  defaultAllDay = false,
  anchorPoint,
}: Props) {
  const dialog = useCalendarEventDialog({
    open,
    onOpenChange,
    event,
    defaultStartAt,
    defaultEndAt,
    defaultAllDay,
  });

  const form = (
    <CalendarEventForm
      isMobile={dialog.isMobile}
      isEdit={dialog.isEdit}
      form={dialog.form}
      allMembers={dialog.allMembers}
      fileInputRef={dialog.fileInputRef}
      startTimeInputRef={dialog.startTimeInputRef}
      endTimeInputRef={dialog.endTimeInputRef}
      startTimeField={dialog.startTimeField}
      endTimeField={dialog.endTimeField}
      allDay={dialog.allDay ?? false}
      visibility={dialog.visibility}
      startAt={dialog.startAt}
      assigneeIds={dialog.assigneeIds}
      previewSrc={dialog.previewSrc}
      busy={dialog.busy}
      dayLabel={dialog.dayLabel}
      setDay={dialog.setDay}
      toggleAssignee={dialog.toggleAssignee}
      pickImageFile={dialog.pickImageFile}
      removeImage={dialog.removeImage}
      handleFormSubmit={dialog.handleFormSubmit}
      onDelete={() => void dialog.onDelete()}
    />
  );

  if (dialog.isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        swipeDirection="down"
        showSwipeHandle
      >
        <DrawerContent className="border-0 bg-background data-[swipe-direction=down]:rounded-t-3xl data-[swipe-direction=down]:[--drawer-content-height:min(92dvh,820px)]">
          <DrawerHeader className="px-4 pt-2 pb-2 text-left!">
            <DrawerTitle>
              {dialog.isEdit ? "Editar evento" : "Novo evento"}
            </DrawerTitle>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            {form}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            className="pointer-events-none fixed z-60 size-px opacity-0"
            style={
              anchorPoint
                ? { left: anchorPoint.x, top: anchorPoint.y }
                : { left: "50%", top: "40%" }
            }
          />
        }
      />
      <PopoverContent
        side="bottom"
        align="center"
        sideOffset={10}
        collisionPadding={20}
        className="w-[min(100vw-2rem,24rem)] gap-4 rounded-2xl p-5 shadow-lg"
      >
        {form}
      </PopoverContent>
    </Popover>
  );
}
