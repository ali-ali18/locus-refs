const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * Converts a relative /storage/... path to an absolute URL for email contexts.
 * External URLs (http/https) are returned as-is.
 */
export function toAbsoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${APP_URL}${path}`;
  return path;
}
