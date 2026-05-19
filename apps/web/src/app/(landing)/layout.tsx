import type { ReactNode } from "react";
import { ContainerHeader } from "@/components/landing/Header";
import { Layout } from "@/components/landing/structure/Structure";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      forcedTheme="light"
      disableTransitionOnChange
    >
      <Layout>
        <ContainerHeader />
        {children}
      </Layout>
    </ThemeProvider>
  );
}
