"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RolesControlPanel } from "@/components/workspace/roles/RolesControlPanel";

function RolesPageFallback() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-[60vh] w-full" />
    </div>
  );
}

export default function WorkspaceRolesPage() {
  return (
    <Suspense fallback={<RolesPageFallback />}>
      <RolesControlPanel />
    </Suspense>
  );
}
