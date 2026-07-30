import { type NextRequest, NextResponse } from "next/server";
import { cleanupExpiredChatUploads } from "@/server/chat-uploads";

/**
 * Cron: remove anexos do chat com mais de 6 meses.
 * Auth: header `Authorization: Bearer ${CRON_SECRET}` ou `x-cron-secret`.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET não configurado", code: "CRON_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const authHeader = request.headers.get("authorization");
  const headerSecret = request.headers.get("x-cron-secret");
  const bearer =
    authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const provided = bearer ?? headerSecret;

  if (!provided || provided !== secret) {
    return NextResponse.json(
      { error: "Não autorizado", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const dryRun = request.nextUrl.searchParams.get("dryRun") === "1";

  try {
    const result = await cleanupExpiredChatUploads({ dryRun });
    return NextResponse.json({
      message: dryRun
        ? "Dry-run: anexos expirados listados"
        : "Anexos expirados removidos",
      data: result,
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Falha ao limpar anexos do chat",
        code: "CLEANUP_FAILED",
        details,
      },
      { status: 500 },
    );
  }
}
