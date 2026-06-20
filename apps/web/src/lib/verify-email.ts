import { getSafeRedirectPath } from "./safe-redirect";

/**
 * Builds the /verify-email URL with email + optional callback.
 *
 * Centralized so that any caller (useRegister after signup, InvitePageClient
 * when user clicks "verify email", etc.) produces the same query shape and
 * keeps the callback through getSafeRedirectPath validation.
 */
export function buildVerifyEmailUrl(params: {
  email: string;
  callbackURL?: string | null;
}): string {
  const params_ = new URLSearchParams({ email: params.email });
  const safe = getSafeRedirectPath(params.callbackURL ?? undefined);
  if (safe !== "/") {
    params_.set("callbackURL", safe);
  }
  return `/verify-email?${params_.toString()}`;
}