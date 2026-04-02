import { Folder01Icon, Note01FreeIcons } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { formatRelativeTime } from "./formatRelativeTime";

interface Props {
  id: string;
  name: string;
  type: "note" | "collection";
  updatedAt: string;
  workspaceSlug: string;
}

export function ActivityListItem({ id, name, type, updatedAt, workspaceSlug }: Props) {
  const href =
    type === "note"
      ? `/${workspaceSlug}/notes/${id}`
      : `/${workspaceSlug}/collections/${id}`;

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-muted transition-colors"
    >
      <span className="text-muted-foreground shrink-0">
        <Icon
          icon={type === "note" ? Note01FreeIcons : Folder01Icon}
          className="size-4"
        />
      </span>
      <span className="flex-1 truncate text-sm">{name}</span>
      <span className="text-xs text-muted-foreground shrink-0">
        {formatRelativeTime(updatedAt)}
      </span>
    </Link>
  );
}
