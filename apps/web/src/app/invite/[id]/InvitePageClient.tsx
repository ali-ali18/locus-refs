"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { WorkspaceLogo } from "@/components/sidebar/WorkspaceLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { setInviteRedirectCookie } from "@/lib/invite-cookie";

interface InviteData {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  inviterName: string;
  inviterImage: string | null;
  organizationName: string;
  organizationSlug: string;
  organizationLogo: string | null;
  memberCount: number;
}

interface Props {
  invitation: InviteData;
  sessionEmail: string | null;
}

export function InvitePageClient({ invitation, sessionEmail }: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isExpired = new Date(invitation.expiresAt) < new Date();
  const isInvalid =
    invitation.status === "canceled" ||
    invitation.status === "rejected" ||
    isExpired;

  const emailMismatch =
    !isInvalid &&
    !!sessionEmail &&
    sessionEmail.toLowerCase() !== invitation.email.toLowerCase();

  const isReady =
    !isInvalid &&
    sessionEmail?.toLowerCase() === invitation.email.toLowerCase() &&
    invitation.status === "pending";

  const isAlreadyAccepted =
    !isInvalid &&
    sessionEmail?.toLowerCase() === invitation.email.toLowerCase() &&
    invitation.status === "accepted";

  async function handleAccept() {
    setIsPending(true);
    const { error: err } = await authClient.organization.acceptInvitation({
      invitationId: invitation.id,
    });
    if (err) {
      setError(err.message ?? "Erro ao aceitar convite");
      setIsPending(false);
      return;
    }
    router.push(`/${invitation.organizationSlug}`);
  }

  async function handleReject() {
    setIsPending(true);
    await authClient.organization.rejectInvitation({
      invitationId: invitation.id,
    });
    router.push("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-muted to-accent/30 p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 rounded-2xl border border-border bg-card shadow-xl px-8 py-10">

        <div className="flex items-center gap-2">
          <Avatar className="size-5 shrink-0">
            <AvatarImage src={invitation.inviterImage ?? undefined} />
            <AvatarFallback className="text-[10px]">
              {invitation.inviterName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{invitation.inviterName}</span>
            convidou você para se juntar
          </p>
        </div>

        <div className="flex items-center justify-center size-24 rounded-2xl border border-border bg-muted shrink-0 overflow-hidden">
          <WorkspaceLogo
            logo={invitation.organizationLogo}
            className="size-12"
            withBackground={false}
          />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{invitation.organizationName}</h1>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary inline-block" />
            <span className="text-sm text-muted-foreground">
              {invitation.memberCount} {invitation.memberCount === 1 ? "membro" : "membros"}
            </span>
          </div>
        </div>

        {isInvalid && (
          <div className="w-full flex flex-col items-center gap-4">
            <p className="text-sm text-destructive text-center">
              {isExpired
                ? "Este convite expirou."
                : "Este convite foi cancelado ou recusado."}
            </p>
            <Button
              variant="ghost"
              rounded="xl"
              className="w-full text-muted-foreground"
              onClick={() => router.push("/")}
            >
              Voltar ao início
            </Button>
          </div>
        )}

        {!isInvalid && !sessionEmail && (
          <div className="w-full flex flex-col gap-3">
            <Button
              rounded="xl"
              className="w-full"
              onClick={() => {
                setInviteRedirectCookie(`/invite/${invitation.id}`);
                router.push("/login");
              }}
            >
              Aceitar convite
            </Button>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center w-full"
              onClick={() => {
                setInviteRedirectCookie(`/invite/${invitation.id}`);
                router.push("/register");
              }}
            >
              Não tem conta? Criar conta
            </button>
          </div>
        )}

        {emailMismatch && (
          <div className="w-full flex flex-col items-center gap-4">
            <p className="text-sm text-destructive text-center">
              Este convite é para <strong>{invitation.email}</strong>.<br />
              Você está conectado como <strong>{sessionEmail}</strong>.
            </p>
          </div>
        )}

        {isAlreadyAccepted && (
          <div className="w-full flex flex-col gap-3">
            <Button
              rounded="xl"
              className="w-full"
              onClick={() => router.push(`/${invitation.organizationSlug}`)}
            >
              Abrir workspace
            </Button>
          </div>
        )}

        {isReady && (
          <div className="w-full flex flex-col gap-3">
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button
              rounded="xl"
              className="w-full"
              disabled={isPending}
              onClick={handleAccept}
            >
              {isPending ? "Aceitando..." : "Aceitar convite"}
            </Button>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center w-full disabled:opacity-50"
              disabled={isPending}
              onClick={handleReject}
            >
              Recusar convite
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
