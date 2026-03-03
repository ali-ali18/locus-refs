import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryClient } from "@/components/shared/QueryClient";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClient>{children}</QueryClient>
          <Toaster position="top-right" expand />
        </ThemeProvider>
      </body>
    </html>
  );
}
