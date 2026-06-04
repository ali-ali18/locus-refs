"use client";

import { HourglassIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

export function UserProfile() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  const name = session?.user?.name ?? "Usuário";
  const email = session?.user?.email ?? "";
  const avatarSrc = session?.user?.image || undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-14 rounded-xl">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback>
            <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-base font-medium">{name}</span>
          <span className="text-sm text-muted-foreground">{email}</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
        <HugeiconsIcon
          icon={HourglassIcon}
          strokeWidth={1.5}
          className="size-6 text-muted-foreground"
        />
        <p className="text-sm font-medium">
          Configurações pessoais em construção
        </p>
        <p className="text-xs text-muted-foreground max-w-sm">
          Em breve você poderá editar preferências da sua conta, trocar senha e
          gerenciar notificações por aqui.
        </p>
      </div>
    </div>
  );
}
