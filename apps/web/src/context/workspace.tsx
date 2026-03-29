"use client";

import { createContext, useContext } from "react";

interface WorkspaceContextValue {
  workspaceId: string;
  workspaceSlug: string;
  workspaceName: string;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
  workspaceId,
  workspaceSlug,
  workspaceName,
  children,
}: WorkspaceContextValue & { children: React.ReactNode }) {
  return (
    <WorkspaceContext.Provider
      value={{ workspaceId, workspaceSlug, workspaceName }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
