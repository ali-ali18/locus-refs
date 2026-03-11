import type { ReactNode } from "react";
import { NavigationMenu } from "@/components/base/NavigationMenu";
import { Header } from "@/components/shared/header/Header";
import { navigationMenuData } from "@/lib/data/navigationMenu.data";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
      <NavigationMenu items={navigationMenuData} />
    </>
  );
}
