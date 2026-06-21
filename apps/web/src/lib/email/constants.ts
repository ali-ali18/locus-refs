/**
 * Email-related constants shared across auth flows.
 *
 * Keep this file framework-agnostic — it must work in both client and server
 * contexts (rendered into email templates AND referenced by Better Auth plugin
 * config in the same project).
 */

export const EMAIL_OTP_LENGTH = 6;
export const EMAIL_OTP_TTL_SECONDS = 600; // 10 minutes
export const EMAIL_OTP_TTL_MINUTES = EMAIL_OTP_TTL_SECONDS / 60;
export const EMAIL_OTP_RESEND_COOLDOWN_SECONDS = 60;

export const EMAIL_SUBJECTS = {
  "email-verification": "Confirme seu email no Locus",
} as const;
