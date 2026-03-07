"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../components/dashboard/services/useCategory";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
  });
}
