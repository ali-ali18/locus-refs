"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
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
import { useNoteTrail } from "@/context/noteTrail";
import { useWorkspace } from "@/context/workspace";
import { resolveIcon } from "@/lib/icons";

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

function parseNoteId(pathname: string): string | null {
  const match = pathname.match(/\/notes\/([^/]+)\/?$/);
  return match?.[1] ?? null;
}

/** Mantém a trilha alinhada com a rota atual (sempre montado). */
export function NoteTrailSync() {
  const pathname = usePathname();
  const { trail, resetTrail, consumeLinkNavigation } = useNoteTrail();
  const currentNoteId = parseNoteId(pathname);

  useEffect(() => {
    if (consumeLinkNavigation()) return;

    if (!currentNoteId) {
      if (trail.length > 0) resetTrail();
      return;
    }

    const last = trail[trail.length - 1];
    if (trail.length > 0 && last && last.id !== currentNoteId) {
      resetTrail();
    }
    // trail lido da closure; deps só de navegação para evitar loop com setTrail([])
  }, [currentNoteId, pathname, resetTrail, consumeLinkNavigation]);

  return null;
}

export function useHasActiveNoteTrail(): boolean {
  const pathname = usePathname();
  const { trail } = useNoteTrail();
  const currentNoteId = parseNoteId(pathname);
  return (
    trail.length >= 2 &&
    !!currentNoteId &&
    trail[trail.length - 1]?.id === currentNoteId
  );
}

/** Breadcrumb da trilha: Home > Nota anterior > Nota aberta > ... */
export function NoteTrailBreadcrumb() {
  const router = useRouter();
  const { workspaceSlug } = useWorkspace();
  const { trail, jumpToTrailIndex, resetTrail } = useNoteTrail();

  if (trail.length < 2) return null;

  const homeHref = `/${workspaceSlug}`;
  const collapsed = trail.length > 2;
  const hidden = collapsed ? trail.slice(0, -1) : [];
  const first = trail[0];
  const last = trail[trail.length - 1];

  function goToIndex(index: number) {
    const target = jumpToTrailIndex(index);
    if (!target) return;
    router.push(`/${workspaceSlug}/notes/${target.id}`);
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink
            render={<Link href={homeHref} />}
            onClick={() => resetTrail()}
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {!collapsed && first && (
          <>
            <BreadcrumbItem>
              <button
                type="button"
                onClick={() => goToIndex(0)}
                className="flex max-w-28 items-center gap-1.5 truncate text-sm text-muted-foreground transition-colors hover:text-foreground sm:max-w-40"
              >
                <ItemIcon icon={first.icon} />
                <span className="truncate">{first.title || "Sem título"}</span>
              </button>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {collapsed && (
          <>
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
                    Notas anteriores
                  </Label>
                  <div className="flex flex-col">
                    {hidden.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => goToIndex(index)}
                        className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <ItemIcon icon={item.icon} />
                        {item.title || "Sem título"}
                      </button>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {last && (
          <BreadcrumbItem>
            <BreadcrumbPage className="flex max-w-28 items-center gap-1.5 truncate sm:max-w-48">
              <ItemIcon icon={last.icon} />
              <span className="truncate">{last.title || "Sem título"}</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
