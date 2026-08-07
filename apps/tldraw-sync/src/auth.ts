import { jwtVerify } from "jose";

/**
 * Payload assinado pelo web app (apps/web) ao abrir um board.
 */
export interface BoardTokenPayload {
  userId: string;
  workspaceId: string;
  boardId: string;
  /** Papel do membro no workspace (base ou cargo customizado). */
  role: string;
  exp?: number;
}

/**
 * Valida o JWT que o cliente envia no header `Authorization: Bearer <token>`
 * ou na query `?token=...` (tldraw useSync não permite custom headers no WS).
 *
 * Retorna o payload se válido, `null` se inválido/expirado.
 *
 * O secret é o mesmo `COLLAB_JWT_SECRET` que o resto do app usa.
 */
export async function verifyBoardToken(
  token: string,
  secret: string,
): Promise<BoardTokenPayload | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as BoardTokenPayload;
  } catch {
    return null;
  }
}
