"use client";

import {
  DashboardSquare01Icon,
  Folder01FreeIcons,
  Home01Icon,
  Note01FreeIcons,
} from "@hugeicons/core-free-icons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type SidebarTab, useSidebarTab } from "@/context/sidebarTab";
import { Icon } from "../shared/Icon";

const TABS: { value: SidebarTab; icon: typeof Home01Icon; label: string }[] = [
  { value: "pages", icon: Home01Icon, label: "Páginas" },
  { value: "resources", icon: Folder01FreeIcons, label: "Recursos" },
  { value: "notes", icon: Note01FreeIcons, label: "Notas" },
  { value: "boards", icon: DashboardSquare01Icon, label: "Boards" },
];

export function SidebarNavTabs() {
  const { activeTab, setActiveTab } = useSidebarTab();

  return (
    <div className="px-2 py-1 group-data-[collapsible=icon]:hidden">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as SidebarTab)}
      >
        <TabsList className="w-full">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1"
              title={tab.label}
            >
              <Icon icon={tab.icon} className="size-4" />
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
