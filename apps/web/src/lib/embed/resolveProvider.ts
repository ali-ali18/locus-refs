import { youtubeProvider } from "./providers/youtube";
import type { EmbedProvider, ResolvedEmbed } from "./types";

const providers: EmbedProvider[] = [youtubeProvider];

export function resolveProvider(raw: string): ResolvedEmbed | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let url: URL;

  try {
    url = new URL(withProtocol);
  } catch {
    return null;
  }

  for (const provider of providers) {
    if (!provider.matcher(url)) continue;
    return provider.resolver(url);
  }

  return null;
}
