"use client";

import { createContext, useContext, useEffect } from "react";
import { setWorkspaceId } from "@/lib/api";

interface WorkspaceContextValue {
  workspaceId: string;
  workspaceSlug: string;
  workspaceName: string;
  workspaceLogo: string | null;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
  workspaceId,
  workspaceSlug,
  workspaceName,
  workspaceLogo,
  children,
}: WorkspaceContextValue & { children: React.ReactNode }) {
  useEffect(() => {
    setWorkspaceId(workspaceId);
  }, [workspaceId]);

  return (
    <WorkspaceContext.Provider
      value={{ workspaceId, workspaceSlug, workspaceName, workspaceLogo }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
