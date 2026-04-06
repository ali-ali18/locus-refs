import {
  Config,
  UserListFreeIcons,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { ReactNode } from "react";
import { WorkspaceConfigClient } from "@/components/workspace/WorkspaceConfigClient";

export interface ConfigNavItem {
  id: string;
  label: string;
  icon: IconSvgElement;
  content: ReactNode;
}

export const configNavItems: ConfigNavItem[] = [
  {
    id: "settings",
    label: "Configurações",
    icon: Config,
    content: <WorkspaceConfigClient />,
  },
  {
    id: "members",
    label: "Usuários",
    icon: UserListFreeIcons,
    content: (
      <div className="text-sm text-muted-foreground">
        Gerenciamento de usuários em breve.
      </div>
    ),
  },
];
