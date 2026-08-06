"use client";

import { CalendarEventDialog } from "./CalendarEventDialog";
import { CalendarMonthView } from "./CalendarMonthView";
import { CalendarSkeleton } from "./CalendarSkeleton";
import { CalendarSlotEventsDrawer } from "./CalendarSlotEventsDrawer";
import { CalendarToolbar } from "./CalendarToolbar";
import { CalendarUpcomingSidebar } from "./CalendarUpcomingSidebar";
import { CalendarWeekView } from "./CalendarWeekView";
import { useContentCalendar } from "./hook/useContentCalendar";

export function ContentCalendar() {
  const cal = useContentCalendar();

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <CalendarToolbar
        isMobile={cal.isMobile}
        titleLabel={cal.titleLabel}
        navLabel={cal.navLabel}
        visibility={cal.visibility}
        viewMenuValue={cal.viewMenuValue}
        onVisibilityChange={cal.setVisibility}
        onViewModeChange={cal.setViewMode}
        onShift={cal.shiftAnchor}
        onToday={cal.goToday}
        onOpenUpcoming={() => cal.setUpcomingOpen(true)}
      />

      <div className="min-h-0 flex-1">
        {cal.isLoading ? (
          <CalendarSkeleton
            mode={cal.effectiveMode}
            compact={cal.isMobile}
          />
        ) : cal.effectiveMode === "month" ? (
          <CalendarMonthView
            month={cal.anchor}
            days={cal.monthDays}
            events={cal.events}
            compact={cal.isMobile}
            onEventClick={cal.openEdit}
            onDayClick={cal.openCreateAllDay}
          />
        ) : (
          <CalendarWeekView
            days={cal.timedDays}
            events={cal.events}
            hourPx={cal.hourPx}
            onEventClick={cal.handleWeekEventClick}
            onSlotClick={cal.handleWeekSlotClick}
          />
        )}
      </div>

      <CalendarUpcomingSidebar
        open={cal.upcomingOpen}
        onOpenChange={cal.setUpcomingOpen}
        events={cal.events}
        onEventClick={cal.openEdit}
      />

      <CalendarSlotEventsDrawer
        open={cal.slotSheetOpen}
        onOpenChange={cal.setSlotSheetOpen}
        sheet={cal.slotSheet}
        onEventClick={cal.handleSlotSheetEventClick}
        onAddEvent={cal.handleSlotSheetAdd}
      />

      <CalendarEventDialog
        open={cal.dialogOpen}
        onOpenChange={cal.setDialogOpen}
        event={cal.editing}
        defaultStartAt={cal.draftStart}
        defaultEndAt={cal.draftEnd}
        defaultAllDay={cal.draftAllDay}
        anchorPoint={cal.popoverAnchor}
      />
    </div>
  );
}
