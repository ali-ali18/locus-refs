"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BubbleChatIcon,
  Cancel01Icon,
  Config,
  UserEdit01Icon,
  UserIcon,
  UserListFreeIcons,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  type SettingsTabId,
  useSettingsDialog,
} from "@/context/settingsDialog";
import { useIsMobile } from "@/hook/use-mobile";
import {
  SETTINGS_PERMISSION_CHECKS,
  useWorkspacePermissions,
} from "@/hook/workspace/useWorkspacePermissions";
import { cn } from "@/lib/utils";
import { WorkspaceAiConfig } from "./config/WorkspaceAiConfig";
import { WorkspaceConfig } from "./config/WorkspaceConfig";
import { WorkspaceHeaderConfig } from "./config/WorkspaceHeaderConfig";
import { WorkspaceUserList } from "./config/WorkspaceUserList";
import { WorkspaceRolesList } from "./roles/WorkspaceRolesList";
import { UserProfile } from "./settings/UserProfile";

interface NavEntry {
  id: SettingsTabId;
  label: string;
  icon: IconSvgElement;
  headerTitle: string;
  headerDescription?: string;
}

const USER_SECTION = "Usuário";
const WORKSPACE_SECTION = "Workspace";

const NAV_ENTRIES: Record<SettingsTabId, NavEntry> = {
  profile: {
    id: "profile",
    label: "Perfil",
    icon: UserIcon,
    headerTitle: "Perfil",
    headerDescription: "Suas informações pessoais e preferências da conta.",
  },
  "workspace-general": {
    id: "workspace-general",
    label: "Geral",
    icon: Config,
    headerTitle: "Geral",
    headerDescription: "Informações e preferências do workspace.",
  },
  "workspace-members": {
    id: "workspace-members",
    label: "Membros",
    icon: UserListFreeIcons,
    headerTitle: "Membros",
    headerDescription: "Gerencie os membros e convites do workspace.",
  },
  "workspace-roles": {
    id: "workspace-roles",
    label: "Cargos",
    icon: UserEdit01Icon,
    headerTitle: "Cargos",
    headerDescription:
      "Crie e edite cargos com permissões personalizadas para o workspace.",
  },
  "workspace-ai": {
    id: "workspace-ai",
    label: "Agent",
    icon: BubbleChatIcon,
    headerTitle: "Agent",
    headerDescription:
      "Modelo, system prompt e skills do Agent neste workspace.",
  },
};

function SettingsTabContent({ id }: { id: SettingsTabId }) {
  switch (id) {
    case "profile":
      return <UserProfile />;
    case "workspace-general":
      return <WorkspaceConfig />;
    case "workspace-members":
      return <WorkspaceUserList />;
    case "workspace-roles":
      return <WorkspaceRolesList />;
    case "workspace-ai":
      return <WorkspaceAiConfig />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

function isWorkspaceTab(id: SettingsTabId): boolean {
  return id.startsWith("workspace-");
}

function useSettingsEntries() {
  const { activeTabId, setActiveTab } = useSettingsDialog();
  const { can, canManageRoles, canUpdateWorkspace, isLoading } =
    useWorkspacePermissions(SETTINGS_PERMISSION_CHECKS);

  const canSeeGeneral = canUpdateWorkspace || can("organization", "update");
  const canSeeMembers =
    can("invitation", "create") ||
    can("member", "update") ||
    can("member", "delete");
  const canSeeRoles = canManageRoles || can("ac", "read");

  useEffect(() => {
    if (isLoading) return;

    const forbidden =
      (activeTabId === "workspace-general" && !canSeeGeneral) ||
      (activeTabId === "workspace-members" && !canSeeMembers) ||
      (activeTabId === "workspace-roles" && !canSeeRoles);

    if (forbidden) {
      setActiveTab("profile");
    }
  }, [
    isLoading,
    activeTabId,
    canSeeGeneral,
    canSeeMembers,
    canSeeRoles,
    setActiveTab,
  ]);

  const entries: NavEntry[] = [
    NAV_ENTRIES.profile,
    ...(canSeeGeneral ? [NAV_ENTRIES["workspace-general"]] : []),
    ...(canSeeMembers ? [NAV_ENTRIES["workspace-members"]] : []),
    ...(canSeeRoles ? [NAV_ENTRIES["workspace-roles"]] : []),
    NAV_ENTRIES["workspace-ai"],
  ];

  const activeEntry = entries.find((e) => e.id === activeTabId) ?? entries[0];

  return { entries, activeEntry, setActiveTab, activeTabId };
}

export function SettingsDialog() {
  const isMobile = useIsMobile();
  if (isMobile) return <SettingsMobileDrawer />;
  return <SettingsDesktopDialog />;
}

function SettingsDesktopDialog() {
  const { open, closeSettings } = useSettingsDialog();
  const { entries, activeEntry, setActiveTab, activeTabId } =
    useSettingsEntries();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeSettings()}>
      <DialogContent
        className="w-[calc(100%-1.5rem)] gap-0 overflow-hidden p-0 sm:max-w-2xl md:max-w-4xl lg:max-w-5xl"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "min(90dvh, 880px)",
          maxHeight: "90dvh",
        }}
        showCloseButton
        closeButtonClassName="top-4"
      >
        <DialogTitle className="sr-only">Configurações</DialogTitle>
        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-[200px_1fr]">
          <nav className="flex min-h-0 min-w-0 flex-col gap-1 overflow-y-auto border-r bg-sidebar px-3 pb-3">
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

            <SettingsSectionLabel label={WORKSPACE_SECTION} className="mt-3" />
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
          </nav>

          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
            <WorkspaceHeaderConfig
              title={activeEntry.headerTitle}
              description={activeEntry.headerDescription}
            />
            <SettingsTabContent id={activeEntry.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SettingsMobileDrawer() {
  const { open, closeSettings, openAsDetail, setActiveTab } =
    useSettingsDialog();
  const { entries, activeEntry } = useSettingsEntries();
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setDetailOpen(false);
      return;
    }
    setDetailOpen(openAsDetail);
  }, [open, openAsDetail]);

  const openDetail = (id: SettingsTabId) => {
    setActiveTab(id);
    setDetailOpen(true);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (!next) closeSettings();
      }}
      showSwipeHandle
    >
      <DrawerContent className="data-[swipe-direction=down]:rounded-t-3xl">
        <DrawerHeader className="flex-row! items-center justify-between gap-3 px-4 pt-1 pb-2 text-left!">
          <DrawerTitle>Configurações</DrawerTitle>
          <DrawerClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                aria-label="Fechar"
              />
            }
          >
            <Icon icon={Cancel01Icon} />
          </DrawerClose>
        </DrawerHeader>

        <div className="px-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <SettingsSectionLabel label={USER_SECTION} />
          {entries
            .filter((e) => !isWorkspaceTab(e.id))
            .map((entry) => (
              <SettingsMobileNavItem
                key={entry.id}
                entry={entry}
                onSelect={openDetail}
              />
            ))}

          <SettingsSectionLabel label={WORKSPACE_SECTION} className="mt-3" />
          {entries
            .filter((e) => isWorkspaceTab(e.id))
            .map((entry) => (
              <SettingsMobileNavItem
                key={entry.id}
                entry={entry}
                onSelect={openDetail}
              />
            ))}
        </div>

        <Drawer open={detailOpen} onOpenChange={setDetailOpen} showSwipeHandle>
          <DrawerContent className="data-[swipe-direction=down]:rounded-t-3xl data-[swipe-direction=down]:[--drawer-content-height:min(85dvh,720px)]">
            <DrawerHeader className="relative w-full flex-row! items-center justify-between px-3 pt-1 pb-2 text-left!">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="relative z-10 shrink-0 rounded-xl"
                onClick={() => setDetailOpen(false)}
                aria-label="Voltar"
              >
                <Icon icon={ArrowLeft01Icon} />
              </Button>
              <DrawerTitle className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 truncate px-12 text-center leading-none">
                {activeEntry.headerTitle}
              </DrawerTitle>
              {activeEntry.headerDescription ? (
                <DrawerDescription className="sr-only">
                  {activeEntry.headerDescription}
                </DrawerDescription>
              ) : null}
              {/* Espelho do botão para equilibrar a altura da row */}
              <div className="size-7 shrink-0" aria-hidden />
            </DrawerHeader>

            <div className="scrollbar-none flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {activeEntry.headerDescription ? (
                <p className="text-sm text-muted-foreground">
                  {activeEntry.headerDescription}
                </p>
              ) : null}
              <SettingsTabContent id={activeEntry.id} />
            </div>
          </DrawerContent>
        </Drawer>
      </DrawerContent>
    </Drawer>
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
        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors",
        isActive
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      <Icon icon={entry.icon} />
      {entry.label}
    </button>
  );
}

function SettingsMobileNavItem({
  entry,
  onSelect,
}: {
  entry: NavEntry;
  onSelect: (id: SettingsTabId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry.id)}
      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-3 text-left text-sm text-foreground transition-colors hover:bg-accent/50"
    >
      <Icon icon={entry.icon} />
      <span className="min-w-0 flex-1 font-medium">{entry.label}</span>
      <Icon
        icon={ArrowRight01Icon}
        className="size-4 shrink-0 text-muted-foreground"
      />
    </button>
  );
}
