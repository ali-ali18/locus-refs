const COOKIE_NAME = "invite_redirect";

export function setInviteRedirectCookie(url: string) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(url)}; path=/; max-age=3600; SameSite=Lax`;
}

export function popInviteRedirectCookie(): string | null {
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  const url = decodeURIComponent(match[1]);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  return url;
}
