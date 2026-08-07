"use client";

import { Container } from "@/components/shared/Container";
import { DashboardActivity } from "./activity/DashboardActivity";
import { DashboardAgenda } from "./agenda/DashboardAgenda";
import { DashboardAgentShortcuts } from "./agent/DashboardAgentShortcuts";
import { DashboardOverviewProvider } from "./data/DashboardOverviewProvider";
import { DashboardOverviewSkeleton } from "./DashboardOverviewSkeleton";
import { DashboardNextEvent } from "./next-event/DashboardNextEvent";
import { DashboardPulse } from "./pulse/DashboardPulse";
import { DashboardTeam } from "./team/DashboardTeam";
import { WelcomeDashboard } from "./welcome/WelcomeDashboard";

export function WrapperOverview() {
  return (
    <Container className="my-6 flex min-w-0 flex-col gap-5 sm:my-8 sm:gap-6">
      <DashboardOverviewProvider fallback={<DashboardOverviewSkeleton />}>
        <WelcomeDashboard />

        <div className="grid min-w-0 items-start gap-4 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
            <DashboardAgenda />
            <div className="grid min-w-0 items-start gap-4 md:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-4">
                <DashboardTeam />
                <DashboardActivity />
              </div>
              <DashboardAgentShortcuts />
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <DashboardPulse />
            <DashboardNextEvent />
          </div>
        </div>
      </DashboardOverviewProvider>
    </Container>
  );
}
