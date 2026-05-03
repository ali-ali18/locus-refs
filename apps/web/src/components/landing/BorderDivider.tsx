import { cn } from "@/lib/utils";

interface BorderDividerProps {
  variant: "shrink" | "flex";
  side: "left" | "right" | "both";
  isStriped?: boolean;
  className?: string;
}

export function BorderDivider({
  variant,
  side,
  isStriped = false,
  className,
}: BorderDividerProps) {
  if (variant === "shrink") {
    const borderSide = side === "left" ? "border-r" : "border-l";
    const borderNone = side === "left" ? "lg:border-r-0" : "lg:border-l-0";

    return (
      <span
        className={cn(
          `w-4 sm:w-6 md:w-12 shrink-0 default-border-color`,
          isStriped && "bg-stripes",
          borderSide,
          borderNone,
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        `hidden flex-1 border-x default-border-color lg:block`,
        isStriped && "bg-stripes",
        className,
      )}
    />
  );
}
