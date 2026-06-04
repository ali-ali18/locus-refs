"use client";

import {
  BubbleChatIcon,
  Config,
  UserIcon,
  UserListFreeIcons,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { type ReactNode, useEffect } from "react";
import { Icon } from "@/components/shared/Icon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  type SettingsTabId,
  useSettingsDialog,
} from "@/context/settingsDialog";
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";
import { cn } from "@/lib/utils";
import { WorkspaceAiConfig } from "./config/WorkspaceAiConfig";
import { WorkspaceConfig } from "./config/WorkspaceConfig";
import { WorkspaceHeaderConfig } from "./config/WorkspaceHeaderConfig";
import { WorkspaceUserList } from "./config/WorkspaceUserList";
import { UserProfile } from "./settings/UserProfile";

interface NavEntry {
  id: SettingsTabId;
  label: string;
  icon: IconSvgElement;
  content: ReactNode;
  headerTitle: string;
  headerDescription?: string;
}

const USER_SECTION = "Usuário";
const WORKSPACE_SECTION = "Workspace";

const ALL_ENTRIES: Record<SettingsTabId, NavEntry> = {
  profile: {
    id: "profile",
    label: "Perfil",
    icon: UserIcon,
    content: <UserProfile />,
    headerTitle: "Perfil",
    headerDescription: "Suas informações pessoais e preferências da conta.",
  },
  "workspace-general": {
    id: "workspace-general",
    label: "Geral",
    icon: Config,
    content: <WorkspaceConfig />,
    headerTitle: "Geral",
    headerDescription: "Informações e preferências do workspace.",
  },
  "workspace-members": {
    id: "workspace-members",
    label: "Membros",
    icon: UserListFreeIcons,
    content: <WorkspaceUserList />,
    headerTitle: "Membros",
    headerDescription: "Gerencie os membros e convites do workspace.",
  },
  "workspace-ai": {
    id: "workspace-ai",
    label: "Assistente IA",
    icon: BubbleChatIcon,
    content: <WorkspaceAiConfig />,
    headerTitle: "Assistente IA",
    headerDescription: "Personalize o assistente de IA padrão deste workspace.",
  },
};

function isWorkspaceTab(id: SettingsTabId): boolean {
  return id.startsWith("workspace-");
}

export function SettingsDialog() {
  const { open, closeSettings, activeTabId, setActiveTab } =
    useSettingsDialog();
  const { currentMember, isLoading } = useWorkspaceMembers();

  const isAdminOrOwner =
    currentMember?.role === "admin" || currentMember?.role === "owner";

  // Fallback silencioso: se um não-admin cair numa tab de workspace, joga pro perfil.
  useEffect(() => {
    if (!isLoading && !isAdminOrOwner && isWorkspaceTab(activeTabId)) {
      setActiveTab("profile");
    }
  }, [isLoading, isAdminOrOwner, activeTabId, setActiveTab]);

  const entries: NavEntry[] = [
    ALL_ENTRIES.profile,
    ...(isAdminOrOwner
      ? [
          ALL_ENTRIES["workspace-general"],
          ALL_ENTRIES["workspace-members"],
          ALL_ENTRIES["workspace-ai"],
        ]
      : []),
  ];

  const activeEntry = entries.find((e) => e.id === activeTabId) ?? entries[0];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeSettings()}>
      <DialogContent
        className="sm:max-w-3xl p-0 gap-0 overflow-hidden"
        style={{ maxHeight: "min(85vh, 800px)" }}
        showCloseButton
      >
        <DialogTitle className="sr-only">Configurações</DialogTitle>
        <div className="flex h-full min-h-0 flex-col">
          <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:min-h-[600px] md:grid-cols-[200px_1fr] md:overflow-hidden">
            <nav className="flex min-h-0 flex-col gap-1 border-b border-border bg-muted/30 p-3 md:border-b-0 md:border-r md:overflow-y-auto">
              <SettingsSectionLabel label={USER_SECTION} />
              {entries
                .filter((e) => !isWorkspaceTab(e.id))
                .map((entry) => (
                  <SettingsNavItem
                    key={entry.id}
                    entry={entry}
                    isActive={activeTabId === entry.id}
                    onSelect={setActiveTab}
                  />
                ))}

              {isAdminOrOwner && (
                <>
                  <SettingsSectionLabel
                    label={WORKSPACE_SECTION}
                    className="mt-3"
                  />
                  {entries
                    .filter((e) => isWorkspaceTab(e.id))
                    .map((entry) => (
                      <SettingsNavItem
                        key={entry.id}
                        entry={entry}
                        isActive={activeTabId === entry.id}
                        onSelect={setActiveTab}
                      />
                    ))}
                </>
              )}
            </nav>

            <div className="flex min-h-0 flex-col gap-6 p-6 md:overflow-y-auto">
              <WorkspaceHeaderConfig
                title={activeEntry.headerTitle}
                description={activeEntry.headerDescription}
              />
              {activeEntry.content}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SettingsSectionLabel({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      {label}
    </p>
  );
}

function SettingsNavItem({
  entry,
  isActive,
  onSelect,
}: {
  entry: NavEntry;
  isActive: boolean;
  onSelect: (id: SettingsTabId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry.id)}
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-left transition-colors",
        isActive
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      <Icon icon={entry.icon} />
      {entry.label}
    </button>
  );
}
