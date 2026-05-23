"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkspace } from "@/context/workspace";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useWorkspaceLogoUpload } from "./useWorkspaceLogoUpload";

interface UpdateWorkspaceParams {
  name: string;
  slug: string;
  logo?: string;
  logoFile?: File;
  previousLogo?: string | null;
}

export function useWorkspaceSettings() {
  const { workspaceId } = useWorkspace();
  const { uploadLogo, isUploading } = useWorkspaceLogoUpload();
  const router = useRouter();

  const updateMutation = useMutation({
    mutationFn: async ({
      name,
      slug,
      logo,
      logoFile,
      previousLogo,
    }: UpdateWorkspaceParams) => {
      let resolvedLogo = logo;

      if (logoFile) {
        resolvedLogo = await uploadLogo(logoFile, workspaceId);
      }

      const { data, error } = await authClient.organization.update({
        organizationId: workspaceId,
        data: { name, slug, logo: resolvedLogo },
      });

      if (error)
        throw new Error(error.message ?? "Erro ao atualizar workspace");

      if (
        previousLogo &&
        previousLogo !== resolvedLogo &&
        previousLogo.startsWith("/storage/")
      ) {
        api
          .delete("/api/upload/workspace-logo", {
            data: { oldUrl: previousLogo },
          })
          .catch(() => {});
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success("Workspace atualizado!");
      if (data?.slug) {
        router.push(`/${data.slug}/config`);
        router.refresh();
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete("/api/workspace");
    },
    onSuccess: () => {
      toast.success("Workspace deletado.");
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    updateWorkspace: updateMutation.mutateAsync,
    deleteWorkspace: deleteMutation.mutateAsync,
    isUpdating: updateMutation.isPending || isUploading,
    isDeleting: deleteMutation.isPending,
  };
}
