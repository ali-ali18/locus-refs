import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ContainerLanding({ children }: { children: ReactNode }) {
  return <main className="min-h-screen space-y-px bg-border">{children}</main>;
}

export type RoundedSide = "t" | "b" | "r" | "l" | "tr" | "tl" | "br" | "bl";

const roundedClassMap: Record<RoundedSide, string> = {
  t: "rounded-t-sm",
  b: "rounded-b-sm",
  r: "rounded-r-sm",
  l: "rounded-l-sm",
  tr: "rounded-tr-sm",
  tl: "rounded-tl-sm",
  br: "rounded-br-sm",
  bl: "rounded-bl-sm",
};

const mirrorMap: Record<RoundedSide, RoundedSide> = {
  t: "t",
  b: "b",
  r: "l",
  l: "r",
  tr: "tl",
  tl: "tr",
  br: "bl",
  bl: "br",
};

interface StructureSideProps {
  rounded?: RoundedSide;
  className?: string;
  bgStripes?: boolean;
}

export function StructureSide({
  rounded,
  className,
  bgStripes,
}: StructureSideProps) {
  return (
    <div
      className={cn(
        "hidden sm:flex sm:flex-1 sm:min-w-10 md:min-w-14 lg:min-w-20 xl:min-w-32 bg-background",
        bgStripes && "bg-stripes",
        rounded && roundedClassMap[rounded],
        className,
      )}
    />
  );
}

interface StructureProps {
  children: ReactNode;
  as?: "div" | "main" | "section" | "header";
  className?: string;
  classNameContent?: string;
  roundedContent?: string;
  roundedSides?: RoundedSide;
  base?: boolean;
  bgStripes?: boolean;
}

export function Structure({
  children,
  className,
  classNameContent,
  as: Component = "div",
  roundedContent,
  roundedSides,
  base = true,
  bgStripes,
}: StructureProps) {
  if (!base) {
    return (
      <Component className={cn("flex gap-px w-full", className)}>
        {children}
      </Component>
    );
  }

  const mirroredSide = roundedSides ? mirrorMap[roundedSides] : undefined;

  return (
    <Component className={cn("flex gap-px w-full", className)}>
      <StructureSide rounded={roundedSides} bgStripes={bgStripes} />
      <div
        className={cn(
          "w-full min-w-0 bg-background relative max-w-7xl",
          roundedContent,
          classNameContent,
        )}
      >
        {children}
      </div>
      <StructureSide rounded={mirroredSide} bgStripes={bgStripes} />
    </Component>
  );
}
