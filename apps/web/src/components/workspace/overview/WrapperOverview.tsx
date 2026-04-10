import { DashboardActivity } from "./activity/DashboardActivity";
import { DashboardStats } from "./DashboardStats";
import { QuickCreate } from "./QuickCreate";
import { Welcome } from "./Welcome";

export function WrapperOverview() {
  return (
    <div className="flex flex-col gap-4">
      <Welcome />
      <DashboardStats />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <DashboardActivity />
        <QuickCreate />
      </div>
    </div>
  );
}