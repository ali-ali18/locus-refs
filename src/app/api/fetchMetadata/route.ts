import * as cheerio from "cheerio";
import { type NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/server/requireSession";

export async function POST(request: NextRequest) {
  await requireSession();

  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
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
        $("title").text() ||
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
