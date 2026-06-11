"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera01Icon, Loading02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FieldGroupApp } from "@/components/base";
import { Icon } from "@/components/shared/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
});

type ProfileSchema = z.infer<typeof profileSchema>;

export function UserProfile() {
  const { data: session, isPending } = authClient.useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    values: { name: session?.user?.name ?? "" },
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-9 w-24 self-end rounded-full" />
      </div>
    );
  }

  const currentAvatar = avatarPreview ?? session?.user?.image ?? undefined;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  async function onSubmit(data: ProfileSchema) {
    setIsSaving(true);
    try {
      let imageUrl: string | undefined;

      if (pendingFile) {
        const formData = new FormData();
        formData.append("file", pendingFile);
        const { data: upload } = await api.post<{ data: { publicUrl: string } }>(
          "/api/user/avatar",
          formData,
        );
        imageUrl = upload.data.publicUrl;
        setPendingFile(null);
      }

      await authClient.updateUser({
        name: data.name,
        ...(imageUrl ? { image: imageUrl } : {}),
      });

      toast.success("Perfil atualizado!");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Avatar + info */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative shrink-0"
          aria-label="Alterar foto de perfil"
        >
          <Avatar className="size-16 rounded-xl">
            <AvatarImage src={currentAvatar} alt={session?.user?.name ?? ""} />
            <AvatarFallback>
              <Icon icon={UserIcon} className="size-5" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Icon icon={Camera01Icon} className="size-4 text-white" />
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{session?.user?.name}</span>
          <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-1 text-left text-xs text-primary underline-offset-4 hover:underline"
          >
            Alterar foto
          </button>
        </div>
      </div>

      {/* Name */}
      <FieldGroupApp<ProfileSchema>
        control={form.control}
        name="name"
        label="Nome"
        placeholder="Seu nome"
        className="rounded-xl"
      />

      <div className="flex justify-end">
        <Button type="submit" rounded="full" disabled={isSaving}>
          {isSaving ? (
            <>
              <Icon icon={Loading02Icon} className="size-4 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>
    </form>
  );
}
