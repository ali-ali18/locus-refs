import {
  ArrowRight01FreeIcons,
  Clock01FreeIcons,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { resolveIcon } from "@/lib/icons";
import { formatDateLabel } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";

interface Props {
  icon?: string | null;
  title: string;
  updatedAt: string;
  createdAt: string;
  id: string;
  workspaceSlug: string;
}

export function CardNotes({
  icon,
  title,
  updatedAt,
  createdAt,
  id,
  workspaceSlug,
}: Props) {
  return (
    <Link
      href={`/${workspaceSlug}/notes/${id}`}
      className="border rounded-2xl pb-4 space-y-3"
    >
      <div>
        <div className="w-full rounded-t-2xl bg-linear-to-br from-[#423E37] via-[#262626] to-[#171717] aspect-video" />
      </div>
      <div className="space-y-2 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 p-2 rounded-xl border">
            <Icon
              icon={resolveIcon(icon ?? "Note02FreeIcons")}
              className="size-5"
            />
          </span>

          <h3 className="text-lg font-bold truncate line-clamp-1">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Icon
            icon={Clock01FreeIcons}
            className="size-4 shrink-0"
            strokeWidth={1.5}
          />
          <span className="text-sm text-muted-foreground">
            {formatDateLabel(updatedAt, createdAt)}
          </span>
        </div>
      </div>

      <div className="flex justify-end px-4 gap-2">
        <Button size="default" variant="outline" rounded="xl">
          <span>Abrir nota</span>
          <Icon icon={ArrowRight01FreeIcons} />
        </Button>
      </div>
    </Link>
  );
}
