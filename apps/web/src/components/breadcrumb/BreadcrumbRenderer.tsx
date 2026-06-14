import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/lib/breadcrumb/route-resolvers";
import { resolveIcon } from "@/lib/icons";

interface BreadcrumbRendererProps {
  items: BreadcrumbItemType[];
}

function ItemIcon({ icon }: { icon?: string | null }) {
  if (!icon) return null;
  try {
    return (
      <HugeiconsIcon icon={resolveIcon(icon)} className="size-3.5 shrink-0" />
    );
  } catch {
    return null;
  }
}

export function BreadcrumbRenderer({ items }: BreadcrumbRendererProps) {
  if (items.length === 0) return null;

  const collapsed = items.length > 2;
  const hidden = collapsed ? items.slice(1, -1) : [];
  const first = items[0];
  const last = items[items.length - 1];

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        {/* Primeiro item sempre visível */}
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href={first.href} />}>
            {first.label}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Itens ocultos como hover card de "..." */}
        {collapsed && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <HoverCard>
                <HoverCardTrigger className="flex items-center px-1 py-1">
                  <BreadcrumbEllipsis />
                </HoverCardTrigger>
                <HoverCardContent
                  className="w-auto min-w-40 rounded-xl p-1"
                  side="bottom"
                  align="start"
                  sideOffset={2}
                >
                  <Label className="px-2 py-1 text-xs text-muted-foreground">
                    Rotas anteriores
                  </Label>
                  <div className="flex flex-col">
                    {hidden.map((item) => (
                      <Link
                        key={item.href || item.label}
                        href={item.href || "#"}
                        className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <ItemIcon icon={item.icon} />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </BreadcrumbItem>
          </>
        )}

        {/* Último item (página atual) sempre visível */}
        {items.length > 1 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex max-w-28 items-center gap-1.5 truncate sm:max-w-48">
                <ItemIcon icon={last.icon} />
                <span className="truncate">{last.label}</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
