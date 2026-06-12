"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera01Icon, FloppyDiskIcon, Loading02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Icon } from "@/components/shared/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <div className="flex flex-col gap-3">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-1">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Row: Avatar */}
      <SettingsRow label="Avatar">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative"
          aria-label="Alterar foto de perfil"
        >
          <Avatar className="size-9 rounded-full">
            <AvatarImage src={currentAvatar} alt={session?.user?.name ?? ""} />
            <AvatarFallback>
              <Icon icon={UserIcon} className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Icon icon={Camera01Icon} className="size-3 text-white" />
          </div>
        </button>
      </SettingsRow>

      <SettingsRow label="Nome">
        <Input
          {...form.register("name")}
          placeholder="Seu nome"
          className="h-8 rounded-lg text-sm"
          aria-invalid={!!form.formState.errors.name}
        />
        {form.formState.errors.name && (
          <p className="text-destructive mt-1 text-xs">
            {form.formState.errors.name.message}
          </p>
        )}
      </SettingsRow>

      {/* Row: Email (readonly) */}
      <SettingsRow label="E-mail">
        <span className="text-muted-foreground text-sm">
          {session?.user?.email}
        </span>
      </SettingsRow>

      <div className="mt-4 flex justify-end">
        <Button type="submit" rounded="full" disabled={isSaving}>
          {isSaving ? (
            <>
              <Icon icon={Loading02Icon} className="size-4 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <Icon icon={FloppyDiskIcon} className="size-4" />
              <span>Salvar</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function SettingsRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-4 border-b border-border py-3 last:border-0">
      <span className="text-sm">{label}</span>
      <div className="flex flex-col items-end">{children}</div>
    </div>
  );
}
