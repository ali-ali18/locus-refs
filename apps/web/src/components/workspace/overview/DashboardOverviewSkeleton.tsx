"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardOverviewSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <Skeleton className="h-9 w-40 sm:w-48" />
          <Skeleton className="h-4 w-full max-w-72" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:gap-3">
          <Skeleton className="h-9 w-full rounded-full sm:w-40" />
          <Skeleton className="h-9 w-full rounded-full sm:w-36" />
        </div>
      </div>

      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
          <Skeleton className="h-48 w-full rounded-3xl" />
          <div className="grid min-w-0 items-start gap-4 md:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-4">
              <Skeleton className="h-52 w-full rounded-[24px]" />
              <Skeleton className="h-44 w-full rounded-[24px]" />
            </div>
            <Skeleton className="h-72 w-full rounded-[24px]" />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-80 w-full rounded-[24px]" />
        </div>
      </div>
    </div>
  );
}
