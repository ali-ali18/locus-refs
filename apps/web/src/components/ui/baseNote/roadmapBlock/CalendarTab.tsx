"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarHeader,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
  type Feature,
} from "@/components/kibo-ui/calendar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { GanttFeature } from "./utils";

type CalendarTabProps = {
  features: GanttFeature[];
};

type DayDialogState = {
  open: boolean;
  date: Date | null;
  features: Feature[];
};

export function CalendarTab({ features }: CalendarTabProps) {
  const [dialogState, setDialogState] = useState<DayDialogState>({
    open: false,
    date: null,
    features: [],
  });

  const handleDayClick = (date: Date, dayFeatures: Feature[]) => {
    setDialogState({ open: true, date, features: dayFeatures });
  };

  return (
    <>
      <CalendarProvider locale="pt-BR" startDay={0}>
        <CalendarDate>
          <CalendarDatePagination className="flex items-center justify-center w-full">
            <CalendarMonthPicker className="rounded-xl border-none w-36 shadow-xs px-2" />
            <CalendarYearPicker
              end={2050}
              start={2020}
              className="rounded-xl border-none shadow-xs px-2"
            />
          </CalendarDatePagination>
        </CalendarDate>
        <CalendarHeader />
        <CalendarBody features={features} onDayClick={handleDayClick}>
          {({ feature, isStart, isEnd, isSingle }) => {
            const barClasses = cn(
              "h-[18px] flex items-center text-xs font-medium overflow-hidden whitespace-nowrap",
              isSingle && "rounded-xl px-1.5 mx-1",
              isStart &&
                !isSingle &&
                "rounded-l-xl rounded-r-none pl-1.5 pr-0 ml-1",
              !isStart && !isEnd && !isSingle && "rounded-none px-0",
              isEnd &&
                !isSingle &&
                "rounded-r-xl rounded-l-none pr-1.5 pl-0 mr-1",
            );
            return (
              <div
                key={feature.id}
                className={barClasses}
                style={{
                  backgroundColor: `${feature.status.color}25`,
                  color: feature.status.color,
                }}
              >
                {isStart || isSingle ? feature.name : "\u00A0"}
              </div>
            );
          }}
        </CalendarBody>
      </CalendarProvider>

      <AlertDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((s) => ({ ...s, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogState.date
                ? format(dialogState.date, "d 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })
                : ""}
            </AlertDialogTitle>
          </AlertDialogHeader>

          {dialogState.features.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-2">
              Nenhuma tarefa neste dia.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {dialogState.features.map((feature) => (
                <li key={feature.id} className="flex items-center gap-2">
                  <span
                    className="shrink-0 h-2 w-2 rounded-full"
                    style={{ backgroundColor: feature.status.color }}
                  />
                  <span className="flex-1 text-sm font-medium truncate">
                    {feature.name}
                  </span>
                  <span
                    className="shrink-0 rounded-xl px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: `${feature.status.color}25`,
                      color: feature.status.color,
                    }}
                  >
                    {feature.status.name}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
