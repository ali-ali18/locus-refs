"use client";

import { ArrowUpDownIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "@/types/categories.type";
import { Icon } from "../shared/Icon";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DropdownCategories } from "./DropdownCategories";

interface ColumnsCategoriesProps {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export const columnsCategories = ({
  onEdit,
  onDelete,
}: ColumnsCategoriesProps): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    meta: {
      label: "Nome",
    },
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        rounded={"xl"}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nome
        <Icon icon={ArrowUpDownIcon} />
      </Button>
    ),
  },
  {
    accessorKey: "slug",
    meta: {
      label: "Slug",
    },
    header: () => <div className="text-left font-bold">Slug</div>,
  },
  {
    accessorKey: "_count.resources",
    meta: {
      label: "Recusos",
    },
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        rounded={"xl"}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Recusos
        <Icon icon={ArrowUpDownIcon} />
      </Button>
    ),
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div>
          {category._count.resources === 0 ? (
            <Badge variant="secondary">0</Badge>
          ) : (
            <Badge variant="secondary">
              {category._count.resources}{" "}
              {category._count.resources === 1 ? "Recurso" : "Recursos"}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="text-end">
          <DropdownCategories
            onEdit={() => onEdit(category)}
            onDelete={() => onDelete(category)}
          />
        </div>
      );
    },
  },
];
