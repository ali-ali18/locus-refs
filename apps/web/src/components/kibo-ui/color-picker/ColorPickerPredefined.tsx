"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const PREDEFINED_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#a855f7", // purple
  "#ec4899", // pink
  "#94a3b8", // slate
  "#6b7280", // gray
];

export type ColorPickerPredefinedProps = Omit<
  ComponentProps<"div">,
  "onChange"
> & {
  value?: string;
  onChange?: (color: string) => void;
};

export function ColorPickerPredefined({
  value,
  onChange,
  className,
  ...props
}: ColorPickerPredefinedProps) {
  return (
    <div className={cn("grid grid-cols-5 gap-2 ml-3", className)} {...props}>
      {PREDEFINED_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={cn(
            "size-8 rounded-full border-2 transition-transform hover:scale-110",
            value === color
              ? "border-foreground scale-110"
              : "border-transparent",
          )}
          style={{ backgroundColor: color }}
          onClick={() => onChange?.(color)}
        />
      ))}
    </div>
  );
}
