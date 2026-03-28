"use client";

import {
  QueryClientProvider,
  QueryClient as ReactQueryClient,
} from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new ReactQueryClient({});

interface QueryClientProps {
  children: ReactNode;
}

export function QueryClient({ children }: QueryClientProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
