"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  EMAIL_OTP_LENGTH,
  EMAIL_OTP_RESEND_COOLDOWN_SECONDS,
} from "@/lib/email/constants";
import { authClient } from "@/lib/auth-client";

const DEFAULT_VERIFY_REDIRECT = "/dashboard";

interface UseVerifyEmailParams {
  email: string;
  alreadyVerified: boolean;
  callbackURL: string | null;
}

interface UseVerifyEmailReturn {
  otp: string;
  setOtp: (next: string) => void;
  isVerifying: boolean;
  isSending: boolean;
  error: string | null;
  cooldown: number;
  handleResend: () => Promise<void>;
}

export function useVerifyEmail({
  email,
  alreadyVerified,
  callbackURL,
}: UseVerifyEmailParams): UseVerifyEmailReturn {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const hasSentInitial = useRef(false);
  const lastSubmitted = useRef("");

  const handleSend = useCallback(async () => {
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
    setCooldown(EMAIL_OTP_RESEND_COOLDOWN_SECONDS);
  }, [email]);

  const handleVerify = useCallback(async () => {
    if (otp.length !== EMAIL_OTP_LENGTH) return;
    if (lastSubmitted.current === otp) return;
    lastSubmitted.current = otp;
    setIsVerifying(true);
    setError(null);
    const { error: verifyErr } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });
    if (verifyErr) {
      setIsVerifying(false);
      setOtp("");
      lastSubmitted.current = "";
      setError(verifyErr.message ?? "Código inválido ou expirado");
      return;
    }
    toast.success("Email confirmado!");
    const target = callbackURL ?? DEFAULT_VERIFY_REDIRECT;
    router.replace(target);
    router.refresh();
  }, [otp, email, callbackURL, router]);

  // Auto-send the first OTP on mount (only if not already verified)
  useEffect(() => {
    if (alreadyVerified || hasSentInitial.current) return;
    hasSentInitial.current = true;
    void handleSend();
  }, [alreadyVerified, handleSend]);

  // Cooldown ticker
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Auto-redirect if already verified
  useEffect(() => {
    if (!alreadyVerified) return;
    const target = callbackURL ?? DEFAULT_VERIFY_REDIRECT;
    router.replace(target);
  }, [alreadyVerified, callbackURL, router]);

  // Auto-submit when OTP is complete (and not already verifying)
  useEffect(() => {
    if (otp.length === EMAIL_OTP_LENGTH && !isVerifying) {
      void handleVerify();
    }
  }, [otp, isVerifying, handleVerify]);

  return {
    otp,
    setOtp,
    isVerifying,
    isSending,
    error,
    cooldown,
    handleResend: handleSend,
  };
}
