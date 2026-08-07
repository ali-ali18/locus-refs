"use client";

import { useState } from "react";
import { CalendarEventDialog } from "@/components/calendar/CalendarEventDialog";
import { useChatPanel } from "@/context/chatPanel";
import { useWorkspace } from "@/context/workspace";
import { authClient } from "@/lib/auth-client";
import { useDashboardOverview } from "../data/useDashboardOverview";
import { DashboardPinnedChips } from "../pinned/DashboardPinnedChips";
import { WelcomeActions } from "./WelcomeActions";
import { WelcomeTeamAvatars } from "./WelcomeTeamAvatars";

export function WelcomeDashboard() {
  const { workspaceName } = useWorkspace();
  const { data: session } = authClient.useSession();
  const { members } = useDashboardOverview();
  const { setOpen: setAgentOpen } = useChatPanel();
  const [openEvent, setOpenEvent] = useState(false);

  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
            Visão geral
          </h1>
          <p className="text-sm text-muted-foreground">
            {firstName ? `Bem-vindo, ${firstName}. ` : ""}
            Acompanhe {workspaceName} num relance.
          </p>
        </div>
        <DashboardPinnedChips />
      </div>

      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
        <WelcomeTeamAvatars members={members} />
        <WelcomeActions
          onOpenAgent={() => setAgentOpen(true)}
          onOpenEvent={() => setOpenEvent(true)}
        />
      </div>

      <CalendarEventDialog open={openEvent} onOpenChange={setOpenEvent} />
    </div>
  );
}
