import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { domAnimation, LazyMotion } from "motion/react";
import { Toaster } from "sonner";
import { QueryClient } from "@/components/shared/QueryClient";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Locus",
  description:
    "Refstash é um projeto de referência para o desenvolvimento de aplicativos web modernos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`antialiased ${nunito.className}`}>
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LazyMotion features={domAnimation}>
              <QueryClient>{children}</QueryClient>
            </LazyMotion>
            <Toaster position="top-right" expand theme="light" />
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
