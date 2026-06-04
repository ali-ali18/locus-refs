import { readFile } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const docPath = request.nextUrl.searchParams.get("path") ?? "";

  // Only allow paths under /docs to prevent directory traversal
  if (!docPath.startsWith("/docs")) {
    return Response.json({ error: "Invalid path" }, { status: 400 });
  }

  const filePath = path.join(
    process.cwd(),
    "src/app/(docs)",
    docPath,
    "page.mdx",
  );

  try {
    const content = await readFile(filePath, "utf-8");
    return new Response(content, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
