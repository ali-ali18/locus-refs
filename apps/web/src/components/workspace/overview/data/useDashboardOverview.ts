"use client";

import { createContext, useContext } from "react";
import type { DashboardOverviewData } from "./useDashboardOverviewQueries";

export const DashboardOverviewContext =
  createContext<DashboardOverviewData | null>(null);

export function useDashboardOverview() {
  const ctx = useContext(DashboardOverviewContext);
  if (!ctx) {
    throw new Error(
      "useDashboardOverview must be used within DashboardOverviewProvider",
    );
  }
  return ctx;
}
