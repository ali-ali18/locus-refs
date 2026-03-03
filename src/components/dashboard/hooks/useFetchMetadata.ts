import { useQuery } from "@tanstack/react-query";
import { fetchMetadata } from "../services/useFetchMetadata";

export function useFetchMetadata(url: string) {
    return useQuery({
        queryKey: ["fetchMetadata", url],
        queryFn: () => fetchMetadata(url),
        enabled: !!url,
    })
}