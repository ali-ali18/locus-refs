"use client";

import type { ReactNode } from "react";
import { DashboardOverviewContext } from "./useDashboardOverview";
import { useDashboardOverviewQueries } from "./useDashboardOverviewQueries";

export function DashboardOverviewProvider({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const { isLoading, data } = useDashboardOverviewQueries();

  if (isLoading) return fallback;

  return (
    <DashboardOverviewContext.Provider value={data}>
      {children}
    </DashboardOverviewContext.Provider>
  );
}
