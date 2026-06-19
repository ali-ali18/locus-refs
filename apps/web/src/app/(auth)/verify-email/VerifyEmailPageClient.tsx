"use client";

import { Loading02Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";

interface Props {
  email: string;
  alreadyVerified: boolean;
  callbackURL: string | null;
}

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailPageClient({
  email,
  alreadyVerified,
  callbackURL,
}: Props) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const hasSentInitial = useRef(false);

  // Auto-send the first OTP on mount if not already verified
  useEffect(() => {
    if (alreadyVerified) return;
    if (hasSentInitial.current) return;
    hasSentInitial.current = true;
    void handleSend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cooldown ticker
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // If already verified, redirect automatically
  useEffect(() => {
    if (alreadyVerified) {
      const target = callbackURL ?? "/dashboard";
      router.replace(target);
    }
  }, [alreadyVerified, callbackURL, router]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !isVerifying) {
      void handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  async function handleSend() {
    setIsSending(true);
    setError(null);
    const { error: sendErr } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });
    setIsSending(false);
    if (sendErr) {
      setError(sendErr.message ?? "Erro ao enviar código");
      return;
    }
    toast.success("Código enviado para o seu email");
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }

  async function handleVerify() {
    setIsVerifying(true);
    setError(null);
    const { error: verifyErr } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });
    if (verifyErr) {
      setIsVerifying(false);
      setOtp("");
      setError(verifyErr.message ?? "Código inválido ou expirado");
      return;
    }
    toast.success("Email confirmado!");
    const target = callbackURL ?? "/dashboard";
    // Force refresh so server components re-read emailVerified
    router.replace(target);
    router.refresh();
  }

  return (
    <AuthLayout
      title="Confirme seu email"
      description={`Digite o código de 6 dígitos enviado para ${email}`}
      footer={
        callbackURL ? (
          <>
            Após confirmar, você será redirecionado para concluir a ação.
          </>
        ) : (
          <>Não tem mais acesso a este email? Fale com o suporte.</>
        )
      }
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="flex justify-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center">
            <Icon icon={Mail01Icon} className="size-5 text-muted-foreground" />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive text-center" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={isVerifying}
            aria-invalid={!!error}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={handleSend}
          disabled={isSending || cooldown > 0}
        >
          {isSending ? (
            <Icon icon={Loading02Icon} className="size-4 animate-spin" />
          ) : cooldown > 0 ? (
            `Reenviar código em ${cooldown}s`
          ) : (
            "Reenviar código"
          )}
        </Button>
      </div>
    </AuthLayout>
  );
}