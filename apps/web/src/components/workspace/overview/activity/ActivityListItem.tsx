"use client";

import {
  DashboardSquare01Icon,
  Folder01Icon,
  Note01FreeIcons,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import {
  type ActivityItem,
  type ActivityType,
  hrefFor,
  typeLabel,
} from "./buildRecentActivity";
import { formatRelativeTime } from "./formatRelativeTime";

function iconFor(type: ActivityType) {
  if (type === "note") return Note01FreeIcons;
  if (type === "collection") return Folder01Icon;
  return DashboardSquare01Icon;
}

export function ActivityListItem({
  item,
  workspaceSlug,
}: {
  item: ActivityItem;
  workspaceSlug: string;
}) {
  return (
    <Link
      href={hrefFor(workspaceSlug, item)}
      className="flex items-center gap-3 rounded-2xl px-2.5 py-2 text-surface-contrast-foreground transition-colors hover:bg-surface-contrast-foreground/10"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-surface-contrast-foreground/10 text-surface-contrast-muted">
        <Icon icon={iconFor(item.type)} className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{item.name}</span>
        <span className="text-xs text-surface-contrast-muted">
          {typeLabel(item.type)} · {formatRelativeTime(item.updatedAt)}
        </span>
      </span>
    </Link>
  );
}
