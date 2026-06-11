import { verifyBoardToken } from "./auth";
import type { Env } from "./env";
import { TldrawDurableObject } from "./TldrawDurableObject";

/**
 * Re-exporta o DO pro wrangler saber como instanciar.
 */
export { TldrawDurableObject };

/**
 * Reflete o Origin da requisição quando ele bate com `ALLOWED_ORIGIN` ou é
 * localhost (dev). Sem isso o upload (fetch PUT) e o serving de imagem seriam
 * bloqueados por CORS quando o app roda em http://localhost:3000.
 */
function corsHeaders(env: Env, request?: Request): HeadersInit {
  const origin = request?.headers.get("Origin");
  const allowOrigin =
    origin &&
    (origin === env.ALLOWED_ORIGIN ||
      /^http:\/\/localhost(:\d+)?$/.test(origin))
      ? origin
      : env.ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(env, request),
      });
    }

    if (url.pathname === "/health") {
      return Response.json(
        { status: "ok", service: "refstash-tldraw-sync" },
        { headers: corsHeaders(env, request) },
      );
    }

    // WebSocket: GET /api/boards/:boardId/connect
    const boardMatch = url.pathname.match(
      /^\/api\/boards\/([a-f0-9-]+)\/connect$/,
    );
    if (boardMatch) {
      return handleBoardConnect(request, env, boardMatch[1]);
    }

    // Assets: PUT (autenticado) / GET (público) /api/uploads/:boardId/:id
    const uploadMatch = url.pathname.match(/^\/api\/uploads\/(.+)$/);
    if (uploadMatch) {
      const objectId = uploadMatch[1];
      if (request.method === "PUT") {
        return handleUploadPut(request, env, objectId);
      }
      if (request.method === "GET") {
        return handleUploadGet(request, env, objectId);
      }
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders(env, request),
      });
    }

    return new Response("Not found", {
      status: 404,
      headers: corsHeaders(env, request),
    });
  },
};

/**
 * PUT /api/uploads/:boardId/:id — grava um asset no R2.
 *
 * Autenticado: exige o mesmo JWT de board (header `Authorization: Bearer`).
 * O objectId precisa começar com `{boardId}/` do token, então um usuário só
 * consegue subir asset pra board que ele tem permissão.
 */
async function handleUploadPut(
  request: Request,
  env: Env,
  objectId: string,
): Promise<Response> {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return new Response("Missing Authorization header", {
      status: 401,
      headers: corsHeaders(env, request),
    });
  }

  const payload = await verifyBoardToken(token, env.COLLAB_JWT_SECRET);
  if (!payload) {
    return new Response("Invalid or expired token", {
      status: 401,
      headers: corsHeaders(env, request),
    });
  }

  if (!objectId.startsWith(`${payload.boardId}/`)) {
    return new Response("Object does not belong to the authorized board", {
      status: 403,
      headers: corsHeaders(env, request),
    });
  }

  const contentType =
    request.headers.get("Content-Type") ?? "application/octet-stream";
  const body = await request.arrayBuffer();
  await env.UPLOADS.put(objectId, body, {
    httpMetadata: { contentType },
  });

  return Response.json({ ok: true }, { headers: corsHeaders(env, request) });
}

/**
 * GET /api/uploads/:boardId/:id — serve um asset do R2.
 *
 * Público: a URL contém um id aleatório (imprevisível) e é a URL salva no
 * store do tldraw, carregada por `<img>` (que não envia header de auth).
 */
async function handleUploadGet(
  request: Request,
  env: Env,
  objectId: string,
): Promise<Response> {
  const object = await env.UPLOADS.get(objectId);
  if (!object) {
    return new Response("Not found", {
      status: 404,
      headers: corsHeaders(env, request),
    });
  }

  const headers = new Headers(corsHeaders(env, request));
  object.writeHttpMetadata(headers);
  headers.set("ETag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
}

/**
 * Valida o JWT (header ou query string), garante que é pro board certo,
 * e forwarda pro DO.
 */
async function handleBoardConnect(
  request: Request,
  env: Env,
  boardId: string,
): Promise<Response> {
  const authHeader = request.headers.get("Authorization");
  let token: string | null = null;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    const url = new URL(request.url);
    token = url.searchParams.get("token");
  }

  if (!token) {
    return new Response("Missing Authorization header or token query param", {
      status: 401,
    });
  }

  const payload = await verifyBoardToken(token, env.COLLAB_JWT_SECRET);
  if (!payload) {
    return new Response("Invalid or expired token", { status: 401 });
  }

  if (payload.boardId !== boardId) {
    return new Response("Token does not match requested board", {
      status: 403,
    });
  }

  const doId = env.TLDRAW_DURABLE_OBJECT.idFromName(`board-${boardId}`);
  const stub = env.TLDRAW_DURABLE_OBJECT.get(doId);
  const doUrl = new URL(request.url);
  doUrl.pathname = "/connect";
  return stub.fetch(new Request(doUrl, request));
}
