import type { ReactNode } from "react";
import { NavigationMenu } from "@/components/base/NavigationMenu";
import { DashboardLayoutHeader } from "@/components/dashboard/DashboardLayoutHeader";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { navigationMenuData } from "@/lib/data/navigationMenu.data";
import { requireSession } from "@/server/requireSession";

interface Props {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  await requireSession();

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardLayoutHeader />
        {children}
      </div>
      <NavigationMenu items={navigationMenuData} />
    </SidebarProvider>
  );
}
