import type { ReactNode } from "react";
import { NavigationMenu } from "@/components/base/NavigationMenu";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { navigationMenuData } from "@/lib/data/navigationMenu.data";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
      <NavigationMenu items={navigationMenuData} />
    </SidebarProvider>
  );
}
