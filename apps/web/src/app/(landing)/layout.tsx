import type { ReactNode } from "react";
import { Header } from "@/components/landing/Header";
import { ContainerLanding } from "@/components/landing/structure/Structure";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      forcedTheme="light"
      disableTransitionOnChange
    >
      <ContainerLanding>
        <Header />
        {children}
      </ContainerLanding>
    </ThemeProvider>
  );
}
