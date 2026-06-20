import { VerifyEmailPageClient } from "@/app/(auth)/verify-email/VerifyEmailPageClient";

interface Props {
  email: string;
  alreadyVerified: boolean;
  callbackURL: string | null;
}

/**
 * Top-level wrapper exposed via @/components/auth/Index for the verify-email
 * route, mirroring the Login/Register export shape.
 */
export function VerifyEmail({
  email,
  alreadyVerified,
  callbackURL,
}: Props) {
  return (
    <VerifyEmailPageClient
      email={email}
      alreadyVerified={alreadyVerified}
      callbackURL={callbackURL}
    />
  );
}