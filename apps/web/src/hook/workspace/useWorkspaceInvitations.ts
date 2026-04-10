"use client";

import type { InviteMemberSchema } from "@refstash/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/workspace";
import { authClient } from "@/lib/auth-client";

export function useWorkspaceInvitations() {
  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["workspace-invitations", workspaceId],
    queryFn: () =>
      authClient.organization.listInvitations({
        query: { organizationId: workspaceId },
      }),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
    select: (res) => (res.data ?? []).filter((inv) => inv.status === "pending"),
  });

  const inviteMutation = useMutation({
    mutationFn: ({ email, role }: InviteMemberSchema) =>
      authClient.organization.inviteMember({
        email,
        role,
        organizationId: workspaceId,
      }),
    onSuccess: () => {
      toast.success("Convite enviado!");
      queryClient.invalidateQueries({
        queryKey: ["workspace-invitations", workspaceId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao enviar convite");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (invitationId: string) =>
      authClient.organization.cancelInvitation({ invitationId }),
    onSuccess: () => {
      toast.success("Convite cancelado.");
      queryClient.invalidateQueries({
        queryKey: ["workspace-invitations", workspaceId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao cancelar convite");
    },
  });

  return {
    invitations: query.data ?? [],
    isLoading: query.isLoading,
    inviteMember: inviteMutation.mutateAsync,
    isInviting: inviteMutation.isPending,
    cancelInvitation: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
  };
}
