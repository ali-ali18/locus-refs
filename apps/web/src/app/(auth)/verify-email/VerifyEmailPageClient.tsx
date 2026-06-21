"use client";

import { Loading02Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useVerifyEmail } from "@/components/auth/hook/useVerifyEmail";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { EMAIL_OTP_LENGTH } from "@/lib/email/constants";

interface Props {
  email: string;
  alreadyVerified: boolean;
  callbackURL: string | null;
}

export function VerifyEmailPageClient({
  email,
  alreadyVerified,
  callbackURL,
}: Props) {
  const { otp, setOtp, isVerifying, isSending, error, cooldown, handleResend } =
    useVerifyEmail({ email, alreadyVerified, callbackURL });

  return (
    <AuthLayout
      title="Confirme seu email"
      description={`Digite o código de ${EMAIL_OTP_LENGTH} dígitos enviado para ${email}`}
      footer={
        callbackURL
          ? "Após confirmar, você será redirecionado para concluir a ação."
          : "Não tem mais acesso a este email? Fale com o suporte."
      }
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="flex justify-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center">
            <Icon icon={Mail01Icon} className="size-5 text-muted-foreground" />
          </div>
        </div>

        {error && (
          <p
            className="text-sm text-destructive text-center"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        <div className="flex justify-center">
          <InputOTP
            maxLength={EMAIL_OTP_LENGTH}
            value={otp}
            onChange={setOtp}
            disabled={isVerifying}
            aria-invalid={!!error}
            aria-label={`Código de verificação de ${EMAIL_OTP_LENGTH} dígitos`}
          >
            <InputOTPGroup>
              {Array.from({ length: EMAIL_OTP_LENGTH }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Index is necessary for a realization of control of input OTP
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={handleResend}
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
