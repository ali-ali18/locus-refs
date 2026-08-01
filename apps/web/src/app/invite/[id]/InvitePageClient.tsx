"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deriveInviteState,
  isEmailVerificationErrorCode,
} from "@/components/auth/hook/useInviteAcceptance";
import { WorkspaceLogo } from "@/components/sidebar/WorkspaceLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  popInviteRedirectCookie,
  setInviteRedirectCookie,
} from "@/lib/invite-cookie";
import { buildVerifyEmailUrl } from "@/lib/verify-email";

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
  emailVerified: boolean;
}

export function InvitePageClient({
  invitation,
  sessionEmail,
  emailVerified,
}: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vm = deriveInviteState({
    invitation,
    sessionEmail,
    emailVerified,
  });

  async function handleAccept() {
    if (!sessionEmail) return;
    setIsPending(true);
    popInviteRedirectCookie();
    try {
      const { error: err } = await authClient.organization.acceptInvitation({
        invitationId: invitation.id,
      });
      if (err) {
        const code = (err as { code?: unknown }).code;
        if (isEmailVerificationErrorCode(code)) {
          router.replace(
            buildVerifyEmailUrl({
              email: sessionEmail,
              callbackURL: `/invite/${invitation.id}`,
            }),
          );
          return;
        }
        setError(err.message || "Erro ao aceitar convite");
        return;
      }
      router.push(`/${invitation.organizationSlug}`);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Erro ao aceitar convite",
      );
    } finally {
      setIsPending(false);
    }
  }

  async function handleReject() {
    setIsPending(true);
    popInviteRedirectCookie();
    try {
      await authClient.organization.rejectInvitation({
        invitationId: invitation.id,
      });
      router.push("/");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Erro ao recusar convite",
      );
    } finally {
      setIsPending(false);
    }
  }

  function handleVerifyEmail() {
    if (!sessionEmail) return;
    router.replace(
      buildVerifyEmailUrl({
        email: sessionEmail,
        callbackURL: `/invite/${invitation.id}`,
      }),
    );
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
            <span className="font-medium text-foreground">
              {invitation.inviterName}
            </span>{" "}
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
          <h1 className="text-2xl font-bold tracking-tight">
            {invitation.organizationName}
          </h1>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary inline-block" />
            <span className="text-sm text-muted-foreground">
              {invitation.memberCount}{" "}
              {invitation.memberCount === 1 ? "membro" : "membros"}
            </span>
          </div>
        </div>

        {vm.isInvalid && (
          <div className="w-full flex flex-col items-center gap-4">
            <p className="text-sm text-destructive text-center">
              {vm.isExpired
                ? "Este convite expirou."
                : "Este convite foi cancelado ou recusado."}
            </p>
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => router.push("/")}
            >
              Voltar ao início
            </Button>
          </div>
        )}

        {!vm.isInvalid && !sessionEmail && (
          <div className="w-full flex flex-col gap-3">
            <Button
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

        {vm.emailMismatch && (
          <div className="w-full flex flex-col items-center gap-4">
            <p className="text-sm text-destructive text-center">
              Este convite é para <strong>{invitation.email}</strong>.<br />
              Você está conectado como <strong>{sessionEmail}</strong>.
            </p>
          </div>
        )}

        {vm.needsEmailVerification && (
          <div className="w-full flex flex-col items-center gap-4">
            <p className="text-sm text-destructive text-center">
              Você precisa verificar seu email <strong>{sessionEmail}</strong>{" "}
              antes de aceitar o convite.
            </p>
            {error && (
              <p className="text-xs text-destructive text-center">{error}</p>
            )}
            <Button className="w-full" onClick={handleVerifyEmail}>
              Verificar email
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

        {vm.isAlreadyAccepted && (
          <div className="w-full flex flex-col gap-3">
            <Button
              className="w-full"
              onClick={() => router.push(`/${invitation.organizationSlug}`)}
            >
              Abrir workspace
            </Button>
          </div>
        )}

        {vm.isReady && (
          <div className="w-full flex flex-col gap-3">
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button
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
