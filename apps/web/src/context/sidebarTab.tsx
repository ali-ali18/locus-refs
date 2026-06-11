"use client";

import { createContext, useContext, useState } from "react";

export type SidebarTab = "pages" | "resources" | "notes" | "boards";

interface SidebarTabContextValue {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
}

const SidebarTabContext = createContext<SidebarTabContextValue | null>(null);

export function SidebarTabProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("pages");

  return (
    <SidebarTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </SidebarTabContext.Provider>
  );
}

export function useSidebarTab() {
  const ctx = useContext(SidebarTabContext);
  if (!ctx)
    throw new Error("useSidebarTab must be used within SidebarTabProvider");
  return ctx;
}
