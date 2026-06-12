import * as cheerio from "cheerio";
import { type NextRequest, NextResponse } from "next/server";
import { requireSessionApiOrThrow } from "@/server/requireSession";

function isBlockedUrl(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return true;
  }
  if (!["http:", "https:"].includes(parsed.protocol)) return true;
  const h = parsed.hostname.toLowerCase();
  return /^(localhost|0\.0\.0\.0|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|::1$|\[::)/.test(h);
}

export async function POST(request: NextRequest) {
  await requireSessionApiOrThrow();

  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  if (isBlockedUrl(url)) {
    return NextResponse.json({ error: "URL inválida" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)",
      },
      signal: AbortSignal.timeout(6000),
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const origin = new URL(url).origin;

    const metadata = {
      title:
        $('meta[property="og:title"]').attr("content") ||
        $("head > title").first().text().trim() ||
        null,
      description:
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        null,
      ogImageUrl: $('meta[property="og:image"]').attr("content") || null,
      iconUrl:
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href") ||
        `${origin}/favicon.ico`,
    };

    if (metadata.iconUrl && !metadata.iconUrl.startsWith("http")) {
      metadata.iconUrl = `${origin}${metadata.iconUrl}`;
    }

    return NextResponse.json(metadata);
  } catch (_error) {
    return NextResponse.json(
      { error: `Failed to fetch URL}` },
      { status: 500 },
    );
  }
}
