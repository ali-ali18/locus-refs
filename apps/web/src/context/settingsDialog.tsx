"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type SettingsTabId =
  | "profile"
  | "workspace-general"
  | "workspace-members"
  | "workspace-ai";

interface SettingsDialogContextValue {
  open: boolean;
  activeTabId: SettingsTabId;
  openSettings: (tab?: SettingsTabId) => void;
  closeSettings: () => void;
  setActiveTab: (tab: SettingsTabId) => void;
}

const SettingsDialogContext = createContext<SettingsDialogContextValue | null>(
  null,
);

const DEFAULT_TAB: SettingsTabId = "profile";

export function SettingsDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<SettingsTabId>(DEFAULT_TAB);

  const openSettings = useCallback((tab?: SettingsTabId) => {
    setActiveTabId(tab ?? DEFAULT_TAB);
    setOpen(true);
  }, []);

  const closeSettings = useCallback(() => setOpen(false), []);

  const value = useMemo<SettingsDialogContextValue>(
    () => ({
      open,
      activeTabId,
      openSettings,
      closeSettings,
      setActiveTab: setActiveTabId,
    }),
    [open, activeTabId, openSettings, closeSettings],
  );

  return (
    <SettingsDialogContext.Provider value={value}>
      {children}
    </SettingsDialogContext.Provider>
  );
}

export function useSettingsDialog() {
  const ctx = useContext(SettingsDialogContext);
  if (!ctx)
    throw new Error(
      "useSettingsDialog must be used within a SettingsDialogProvider",
    );
  return ctx;
}
