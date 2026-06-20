import "server-only";

import { requireSession } from "@/server/requireSession";
import { VerifyEmailPage as VerifyEmailPageComponent } from "@/components/auth/Index";

interface Props {
  searchParams: Promise<{ callbackURL?: string; email?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { callbackURL, email: emailParam } = await searchParams;

  const session = await requireSession();

  // Only honor emailParam if it matches the authenticated user's email —
  // prevents phishing via crafted /verify-email?email=attacker@… URLs.
  const trustedEmail = session.user.email;
  const email =
    emailParam && emailParam === trustedEmail ? emailParam : trustedEmail;

  const alreadyVerified = session.user.emailVerified === true;

  return (
    <VerifyEmailPageComponent
      email={email}
      alreadyVerified={alreadyVerified}
      callbackURL={callbackURL ?? null}
    />
  );
}