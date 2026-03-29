"use client";

import {
  Folder01Icon,
  HomeFreeIcons,
  Note01Icon,
} from "@hugeicons/core-free-icons";
import { NavigationMenu } from "@/components/base/NavigationMenu";
import { useWorkspace } from "@/context/workspace";

export function WorkspaceNavigationMenu() {
  const { workspaceSlug } = useWorkspace();

  const items = [
    { icon: HomeFreeIcons, label: "Dashboard", href: `/${workspaceSlug}` },
    { icon: Folder01Icon, label: "Categorias", href: `/${workspaceSlug}/categories` },
    { icon: Note01Icon, label: "Notas", href: `/${workspaceSlug}/notes` },
  ];

  return <NavigationMenu items={items} />;
}
