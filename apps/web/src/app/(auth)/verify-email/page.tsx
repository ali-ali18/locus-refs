import "server-only";

import { requireSession } from "@/server/requireSession";
import { VerifyEmailPage as VerifyEmailPageComponent } from "@/components/auth/Index";
import { getSafeRedirectPath } from "@/lib/safe-redirect";

interface Props {
  searchParams: Promise<{ callbackURL?: string; email?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { callbackURL, email: emailParam } = await searchParams;

  const session = await requireSession();

  const trustedEmail = session.user.email;
  const email =
    emailParam && emailParam.toLowerCase() === trustedEmail.toLowerCase()
      ? emailParam
      : trustedEmail;

  const alreadyVerified = session.user.emailVerified === true;
  const safeCallbackURL = getSafeRedirectPath(callbackURL);

  return (
    <VerifyEmailPageComponent
      email={email}
      alreadyVerified={alreadyVerified}
      callbackURL={safeCallbackURL === "/" ? null : safeCallbackURL}
    />
  );
}
