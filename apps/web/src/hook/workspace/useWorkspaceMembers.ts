import { useQuery } from "@tanstack/react-query";
import { useWorkspace } from "@/context/workspace";
import { authClient } from "@/lib/auth-client";

export function useWorkspaceMembers() {
  const { workspaceId } = useWorkspace();
  const { data: session } = authClient.useSession();

  const query = useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () =>
      authClient.organization.listMembers({
        query: { organizationId: workspaceId },
      }),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });

  const members = query.data?.data?.members?.filter(
    (m) => m.userId !== session?.user.id,
  );

  return { ...query, members };
}
