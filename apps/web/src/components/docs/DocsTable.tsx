import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DocsTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-border rounded-xl overflow-hidden mb-6 text-sm",
        className,
      )}
    >
      <table className="w-full border-collapse [&_thead]:bg-muted [&_thead]:border-b [&_thead]:border-border [&_tr]:border-b [&_tr:last-child]:border-b-0 [&_th]:px-4 [&_th]:py-3 [&_th]:font-medium [&_th]:text-foreground [&_th]:text-left [&_th]:border-r [&_th]:border-border [&_th:last-child]:border-r-0 [&_td]:px-4 [&_td]:py-3 [&_td]:text-muted-foreground [&_td]:border-r [&_td]:border-border [&_td:last-child]:border-r-0">
        {children}
      </table>
    </div>
  );
}
