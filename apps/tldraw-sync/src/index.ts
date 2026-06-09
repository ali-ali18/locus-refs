import { verifyBoardToken } from "./auth";
import type { Env } from "./env";
import { TldrawDurableObject } from "./TldrawDurableObject";

/**
 * Re-exporta o DO pro wrangler saber como instanciar.
 */
export { TldrawDurableObject };

function corsHeaders(env: Env): HeadersInit {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // === CORS preflight ===
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    // === Health check ===
    if (url.pathname === "/health") {
      return Response.json(
        { status: "ok", service: "refstash-tldraw-sync" },
        { headers: corsHeaders(env) },
      );
    }

    // === WebSocket: POST /api/boards/:boardId/connect ===
    const boardMatch = url.pathname.match(
      /^\/api\/boards\/([a-f0-9-]+)\/connect$/,
    );
    if (boardMatch) {
      return handleBoardConnect(request, env, boardMatch[1]);
    }

    return new Response("Not found", {
      status: 404,
      headers: corsHeaders(env),
    });
  },
};

/**
 * Valida o JWT, garante que é pro board certo, e forwarda pro DO.
 *
 * Auth: o web app (apps/web) emite um JWT assinado com `COLLAB_JWT_SECRET`
 * contendo { userId, workspaceId, boardId, role } quando o usuário abre um board.
 * O worker valida o token e deixa entrar.
 */
async function handleBoardConnect(
  request: Request,
  env: Env,
  boardId: string,
): Promise<Response> {
  // 1. Extrai o Bearer token
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response("Missing Authorization header", { status: 401 });
  }
  const token = authHeader.slice(7);

  // 2. Valida o JWT
  const payload = await verifyBoardToken(token, env.COLLAB_JWT_SECRET);
  if (!payload) {
    return new Response("Invalid or expired token", { status: 401 });
  }

  // 3. Garante que o token é pra ESSE board
  if (payload.boardId !== boardId) {
    return new Response("Token does not match requested board", {
      status: 403,
    });
  }

  // 4. (v2) Aqui a gente checa role: viewer (member) → read-only
  //    Por enquanto, o cliente já controla o readOnly via prop do editor.
  //    TODO Fase 8: implementar enforcement server-side

  // 5. Forward pro DO deste board
  const doId = env.TLDRAW_DURABLE_OBJECT.idFromName(`board-${boardId}`);
  const stub = env.TLDRAW_DURABLE_OBJECT.get(doId);
  return stub.fetch(request);
}
