import type { YoutubeProvider } from "../types";

export const youtubeProvider: YoutubeProvider = {
  id: "youtube",
  matcher: (url) => {
    const host = url.hostname.replace(/^www\./, "");
    return (
      host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com"
    );
  },
  resolver: (url) => {
    const host = url.hostname.replace(/^www\./, "");
    let id: string | null = null;

    if (host === "youtu.be") {
      id = url.pathname.slice(1).split("/")[0] || null;
    } else if (
      url.pathname.startsWith("/shorts/") ||
      url.pathname.startsWith("/embed/")
    ) {
      id = url.pathname.split("/")[2] || null;
    } else {
      id = url.searchParams.get("v");
    }

    if (!id) return null;

    // YouTube video ids are 11 chars; strip tracking junk if present
    const providerId = id.split(/[?&#]/)[0] ?? id;
    if (!/^[\w-]{11}$/.test(providerId)) return null;

    return {
      url: url.toString(),
      provider: "youtube",
      providerId,
    };
  },

  getThumbnail: (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  getVideoSrc: (id) =>
    `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
};
