import {
  ArrowRight02Icon,
  Edit01Icon,
  Link01Icon,
  MoreVerticalIcon,
  Trash2,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenuApp } from "@/components/base/DropdownMenuApp";
import { Icon } from "@/components/shared/Icon";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
  title: string;
  link: string;
  category: string;
  description?: string | null;
  initials?: string;
  iconColor?: string;
  iconUrl?: string | null;
  onEdit?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export function ResourceCard({
  title,
  link,
  category,
  description,
  initials = "Aa",
  iconColor = "bg-primary/10 text-primary",
  iconUrl,
  onEdit,
  onDelete,
}: ResourceCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(e);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.();
  };

  return (
    <div className="group relative block h-full outline-none transition-all duration-400">
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-0 rounded-xl outline-none"
        aria-label={`Abrir recurso: ${title}`}
      />
      <div className="relative z-10 flex h-full flex-col justify-between p-6 transition-all duration-400 bg-muted rounded-xl hover:bg-muted/80 pointer-events-none [&_.resource-card-delete]:pointer-events-auto">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div className="shrink-0">
            {iconUrl ? (
              <Image
                src={iconUrl}
                alt={title}
                width={64}
                height={64}
                unoptimized
                className="size-16 rounded-2xl border bg-transparent object-contain p-2"
              />
            ) : (
              <div
                className={cn(
                  "size-16 rounded-2xl flex items-center justify-center text-2xl font-bold tracking-tight shadow-sm select-none",
                  iconColor,
                )}
              >
                {initials}
              </div>
            )}
          </div>
          {onEdit || onDelete ? (
            <div className="resource-card-delete shrink-0 opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
              <DropdownMenuApp
                className="rounded-full border"
                trigger={<Icon icon={MoreVerticalIcon} className="size-4" />}
                contentClassName="w-44"
              >
                {onEdit ? (
                  <DropdownMenuItem onClick={handleEdit} className={"rounded-xl"}>
                    <Icon icon={Edit01Icon} className="size-4" />
                    Editar recurso
                  </DropdownMenuItem>
                ) : null}
                {onEdit && onDelete ? <DropdownMenuSeparator /> : null}
                {onDelete ? (
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className={"rounded-xl"}
                  >
                    <Icon icon={Trash2} className="size-4" />
                    Excluir recurso
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuApp>
            </div>
          ) : null}
        </div>

        <div className="mt-auto space-y-2.5">
          <Badge variant="outline">{category}</Badge>

          <h3 className="text-xl font-bold tracking-tight text-foreground line-clamp-1">
            {title}
          </h3>
          {description ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          ) : null}

          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2 bg-primary/10 px-3.5 py-1 rounded-full">
              <Icon icon={Link01Icon} className="size-3.5 shrink-0" />
              <span className="truncate font-medium text-base">
                {link.replace(/^https?:\/\/(www\.)?/, "").slice(0, 18)}...
              </span>
            </div>
            <span
              className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 border shrink-0"
              aria-hidden
            >
              <Icon
                icon={ArrowRight02Icon}
                className="size-3.5 shrink-0 group-hover:-rotate-45 transition-transform duration-200"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
