"use client";

import {
  QueryClientProvider,
  QueryClient as ReactQueryClient,
} from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

interface QueryClientProps {
  children: ReactNode;
}

export function QueryClient({ children }: QueryClientProps) {
  // Instância por montagem do provider — evita contexto órfão com HMR/Turbopack
  // (singleton em módulo pode dessincronizar de useQuery após hot reload).
  const [queryClient] = useState(() => new ReactQueryClient({}));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
