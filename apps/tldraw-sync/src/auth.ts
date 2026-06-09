import { jwtVerify } from "jose";

/**
 * Payload assinado pelo web app (apps/web) ao abrir um board.
 * Mesmo formato do CollabContext que o Hocuspocus usa em apps/collab.
 */
export interface BoardTokenPayload {
  userId: string;
  workspaceId: string;
  boardId: string;
  role: "owner" | "admin" | "member";
  exp?: number;
}

/**
 * Valida o JWT que o cliente envia no header `Authorization: Bearer <token>`.
 * Retorna o payload se válido, `null` se inválido/expirado.
 *
 * O secret é o mesmo `COLLAB_JWT_SECRET` que o Hocuspocus usa — auth unificada
 * entre os dois backends de collab.
 */
export async function verifyBoardToken(
  token: string,
  secret: string
): Promise<BoardTokenPayload | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as BoardTokenPayload;
  } catch {
    return null;
  }
}
