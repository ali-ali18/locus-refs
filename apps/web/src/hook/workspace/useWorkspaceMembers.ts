"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/workspace";
import { authClient } from "@/lib/auth-client";

export function useWorkspaceMembers() {
  const { workspaceId } = useWorkspace();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const membersKey = ["workspace-members", workspaceId];

  const query = useQuery({
    queryKey: membersKey,
    queryFn: () =>
      authClient.organization.listMembers({
        query: { organizationId: workspaceId },
      }),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });

  const allMembers = query.data?.data?.members;

  const currentMember = allMembers?.find((m) => m.userId === session?.user.id);

  const members = allMembers?.filter((m) => m.userId !== session?.user.id);

  const removeMemberMutation = useMutation({
    mutationFn: (memberIdOrEmail: string) =>
      authClient.organization.removeMember({
        memberIdOrEmail,
        organizationId: workspaceId,
      }),
    onSuccess: () => {
      toast.success("Membro removido.");
      queryClient.invalidateQueries({ queryKey: membersKey });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao remover membro");
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: string }) =>
      authClient.organization.updateMemberRole({
        memberId,
        role,
        organizationId: workspaceId,
      }),
    onSuccess: () => {
      toast.success("Cargo atualizado.");
      queryClient.invalidateQueries({ queryKey: membersKey });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao atualizar cargo");
    },
  });

  return {
    ...query,
    members,
    currentMember,
    removeMember: removeMemberMutation.mutate,
    isRemoving: removeMemberMutation.isPending,
    updateRole: updateRoleMutation.mutate,
    isUpdatingRole: updateRoleMutation.isPending,
  };
}
