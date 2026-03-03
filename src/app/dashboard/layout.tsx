import type { ReactNode } from "react";
import { Header } from "@/components/shared/header/Header";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
