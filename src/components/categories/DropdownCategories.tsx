import {
  Edit01Icon,
  MoreVerticalIcon,
  Trash2,
} from "@hugeicons/core-free-icons";
import { DropdownMenuApp } from "../base/DropdownMenuApp";
import { Icon } from "../shared/Icon";

interface DropdownCategoriesProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function DropdownCategories({
  onEdit,
  onDelete,
}: DropdownCategoriesProps) {
  
  const menuItems = [
    {
      icon: Edit01Icon,
      label: "Editar categoria",
      onClick: () => onEdit(),
    },
    {
      icon: Trash2,
      label: "Excluir categoria",
      onClick: () => onDelete(),
    },
  ];

  return (
    <DropdownMenuApp
      className="p-1"
      trigger={<Icon icon={MoreVerticalIcon} className="size-5" />}
      contentClassName="w-44 rounded-xl space-y-1"
      items={menuItems}
    />
  );
}
