"use client";

import dynamic from "next/dynamic";

export const WorkspaceConfigClient = dynamic(
  () =>
    import("@/components/workspace/config/WorkspaceConfig").then(
      (m) => m.WorkspaceConfig,
    ),
  { ssr: false },
);
