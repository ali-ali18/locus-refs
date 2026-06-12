const FALLBACK_PATH = "/";

export function getSafeRedirectPath(input: string | null | undefined): string {
  if (!input) return FALLBACK_PATH;

  if (!input.startsWith("/")) return FALLBACK_PATH;
  if (input.startsWith("//")) return FALLBACK_PATH;
  if (input.startsWith("/\\")) return FALLBACK_PATH;
  if (input.startsWith("\\")) return FALLBACK_PATH;
  if (input.includes("..")) return FALLBACK_PATH;
  if (input.includes("\0")) return FALLBACK_PATH;

  return input;
}
