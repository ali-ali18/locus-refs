"use client";

import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarHeader,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from "@/components/kibo-ui/calendar";
import type { GanttFeature } from "./utils";

type CalendarTabProps = {
  features: GanttFeature[];
};

export function CalendarTab({ features }: CalendarTabProps) {
  return (
    <CalendarProvider className="min-h-48" locale="pt-BR" startDay={0}>
      <CalendarDate >
        <CalendarDatePagination className="flex items-center justify-center w-full">
          <CalendarMonthPicker className="rounded-xl border-none w-36 shadow-xs px-2" />
          <CalendarYearPicker end={2050} start={2020} className="rounded-xl border-none shadow-xs px-2"/>
        </CalendarDatePagination>
      </CalendarDate>
      <CalendarHeader />
      <CalendarBody features={features}>
        {({ feature }) => (
          <div
            key={feature.id}
            className="truncate rounded-xl px-1.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: `${feature.status.color}25`,
              color: feature.status.color,
            }}
          >
            {feature.name}
          </div>
        )}
      </CalendarBody>
    </CalendarProvider>
  );
}
