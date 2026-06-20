interface InviteLike {
  email: string;
  status: string;
  expiresAt: string;
}

export interface InviteViewModel {
  isExpired: boolean;
  isInvalid: boolean;
  emailMismatch: boolean;
  isReady: boolean;
  isAlreadyAccepted: boolean;
  needsEmailVerification: boolean;
}

const emailsMatch = (a: string | null | undefined, b: string) =>
  !!a && a.toLowerCase() === b.toLowerCase();

/**
 * Pure state derivation for the invite page. Extracted so the component
 * stays focused on rendering and so the logic is trivially unit-testable.
 */
export function deriveInviteState(params: {
  invitation: InviteLike;
  sessionEmail: string | null;
  emailVerified: boolean;
  now?: Date;
}): InviteViewModel {
  const { invitation, sessionEmail, emailVerified, now = new Date() } = params;

  const isExpired = new Date(invitation.expiresAt) < now;
  const isInvalid =
    invitation.status === "canceled" ||
    invitation.status === "rejected" ||
    isExpired;

  const sessionMatches = emailsMatch(sessionEmail, invitation.email);

  const emailMismatch = !isInvalid && !!sessionEmail && !sessionMatches;

  const isReady =
    !isInvalid &&
    emailVerified &&
    sessionMatches &&
    invitation.status === "pending";

  const isAlreadyAccepted =
    !isInvalid && sessionMatches && invitation.status === "accepted";

  const needsEmailVerification =
    !isInvalid && sessionMatches && !emailVerified;

  return {
    isExpired,
    isInvalid,
    emailMismatch,
    isReady,
    isAlreadyAccepted,
    needsEmailVerification,
  };
}

/**
 * Map a Better Auth error to the email-verification redirect. Returns null if
 * the error is unrelated to email verification.
 */
export function isEmailVerificationErrorCode(code: unknown): boolean {
  if (typeof code !== "string") return false;
  return (
    code.includes("EMAIL_VERIFICATION_REQUIRED") ||
    code.includes("EMAIL_NOT_VERIFIED")
  );
}