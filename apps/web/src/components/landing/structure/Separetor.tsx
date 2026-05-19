import { cn } from "@/lib/utils";
import { BorderDivider } from "../BorderDivider";
import { NodeConnector } from "../NodeConnector";
import { baseClassContent } from "./Structure";

interface Props {
  className?: string;
  isStriped?: boolean;
}

export function SeparetorLading({ className, isStriped = false }: Props) {
  return (
    <div
      className={cn(
        "bg-background flex min-w-0 border-border relative size-full border-b",
      )}
    >
      <NodeConnector position="left" showOnLg />
      <NodeConnector position="right" showOnLg />
      <BorderDivider variant="shrink" side="left" />
      <BorderDivider variant="flex" side="left" />
      <div className={cn(baseClassContent, className, "h-3 z-2")}>
        <NodeConnector position="left" />
        <NodeConnector position="right" />
      </div>
      <div
        className={cn(
          isStriped && "bg-stripes h-full w-full absolute inset-0",
        )}
      />
      <BorderDivider variant="flex" side="right" />
      <BorderDivider variant="shrink" side="right" />
    </div>
  );
}
