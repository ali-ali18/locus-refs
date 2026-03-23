"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  className?: string;
  numberOfMonths?: number;
}

export function RangePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  label,
  id = "range-picker",
  className,
  numberOfMonths = 2,
}: RangePickerProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<
    DateRange | undefined
  >(value);

  const selectedRange = isControlled ? value : internalValue;

  const handleSelect = (range: DateRange | undefined) => {
    if (!isControlled) {
      setInternalValue(range);
    }
    onChange?.(range);
  };

  return (
    <Field className={className}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              id={id}
              className="justify-start rounded-xl px-2.5 font-normal"
            >
              <CalendarIcon data-icon="inline-start" />
              {selectedRange?.from ? (
                selectedRange.to ? (
                  <>
                    {format(selectedRange.from, "LLL dd, y")} -{" "}
                    {format(selectedRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(selectedRange.from, "LLL dd, y")
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0 rounded-xl" align="start">
          <Calendar
            mode="range"
            defaultMonth={selectedRange?.from}
            selected={selectedRange}
            onSelect={handleSelect}
            numberOfMonths={numberOfMonths}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

export function DatePickerWithRange() {
  return <RangePicker label="Date Picker Range" />;
}
