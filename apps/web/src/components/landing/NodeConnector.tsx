interface NodeConnectorProps {
  position: "left" | "right";
  showOnLg?: boolean;
  className?: string;
}

export function NodeConnector({
  position,
  showOnLg = false,
  className,
}: NodeConnectorProps) {
  return (
    <div
      className={`
        absolute z-99 size-1.5 rotate-45 border border-offgray-100 dark:border-offgray-900 
        bg-background dark:bg-[hsl(219,92%,2%)] 
        ${showOnLg ? "hidden lg:block" : ""}
        ${className ?? ""}
      `.trim()}
      style={{
        bottom: "calc(-1 * var(--node-vertical-offset))",
        [position]: "var(--node-horizontal-offset)",
      }}
    />
  );
}
