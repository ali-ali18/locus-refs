export type EmbedProviderId = "youtube";

export type ResolvedEmbed = {
  url: string;
  provider: EmbedProviderId;
  providerId: string;
};

export type EmbedProvider = {
  id: EmbedProviderId;
  matcher: (url: URL) => boolean;
  resolver: (url: URL) => ResolvedEmbed | null;
};

export type YoutubeProvider = EmbedProvider & {
  id: "youtube";
  getThumbnail: (providerId: string) => string;
  getVideoSrc: (providerId: string) => string;
};
