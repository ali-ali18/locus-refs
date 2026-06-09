import { DurableObject } from "cloudflare:workers";
import {
  DurableObjectSqliteSyncWrapper,
  SQLiteSyncStorage,
  TLSocketRoom,
} from "@tldraw/sync-core";
import type { TLRecord } from "@tldraw/tlschema";
import type { Env } from "./env";
import { schema } from "./schema";

/**
 * Estado anexado a cada WebSocket via `serializeAttachment`.
 *
 * A Cloudflare preserva esse attachment quando o DO hiberna, então o
 * `sessionId` continua disponível quando o DO acorda numa próxima request.
 *
 * Na v3 do `@tldraw/sync-core`, o equivalente era mantido em `onSessionSnapshot`
 * (callback de room). Na v4, esse hook foi removido: o roteamento é feito
 * por handlers explícitos do DO (`webSocketMessage`/`Close`/`Error`).
 */
interface SocketAttachment {
  sessionId: string;
}

/**
 * 1 instância por board (criada via `env.TLDRAW_DURABLE_OBJECT.idFromName("board-{id}")`).
 *
 * Persistência: as shapes vivem no SQLite embutido do DO, gerenciado por
 * `SQLiteSyncStorage` + `DurableObjectSqliteSyncWrapper`. Quando o DO acorda
 * de uma hibernação, `getOrCreateRoom()` reconstrói um `TLSocketRoom` vazio
 * e o `SQLiteSyncStorage` rehidrata o documento lendo das tabelas que o
 * próprio wrapper cria (`documents` / `tombstones` / `metadata`).
 *
 * Hibernação (Cloudflare Durable Objects WebSocket Hibernation API):
 *   1. `fetch` faz upgrade do WS e chama `ctx.acceptWebSocket(server)` —
 *      NÃO `server.accept()` (esse último desabilita a hibernação).
 *   2. O `sessionId` é guardado no próprio WS via `serializeAttachment`
 *      (preservado entre hibernações).
 *   3. `room.handleSocketConnect({ sessionId, socket })` registra a sessão
 *      no room. O `socket.addEventListener?.(...)` interno é no-op porque
 *      o WS do Cloudflare não expõe essa API; o roteamento real é feito
 *      pelos handlers `webSocketMessage`/`webSocketClose`/`webSocketError`
 *      declarados abaixo.
 *   4. Quando chega uma mensagem, o DO acorda e `webSocketMessage` é
 *      invocado → `room.handleSocketMessage(sessionId, message)`.
 *   5. Quando o WS fecha, `webSocketClose` é invocado →
 *      `room.handleSocketClose(sessionId)`.
 *
 * O `clientTimeout: Infinity` desativa o timeout de inatividade no nível
 * do room — a hibernação do DO já mantém o WS vivo, e o default de
 * `setHibernatableWebSocketEventTimeout` do Cloudflare (30s) detecta
 * WSs zumbis sem acordar o DO.
 */
export class TldrawDurableObject extends DurableObject<Env> {
  private room: TLSocketRoom<TLRecord, void> | null = null;
  private roomPromise: Promise<TLSocketRoom<TLRecord, void>> | null = null;

  /**
   * Inicialização preguiçosa do room, com `blockConcurrencyWhile` para evitar
   * uma race entre múltiplos eventos (mensagens, close) chegando ao mesmo
   * tempo no DO logo após uma hibernação.
   */
  private getOrCreateRoom(): Promise<TLSocketRoom<TLRecord, void>> {
    if (this.room) return Promise.resolve(this.room);
    if (this.roomPromise) return this.roomPromise;

    this.roomPromise = this.ctx.blockConcurrencyWhile(async () => {
      if (this.room) return this.room;

      // `DurableObjectSqliteSyncWrapper` precisa de um objeto que combine
      // `sql.exec(...)` e `transactionSync(...)`. `this.ctx.storage`
      // (`DurableObjectStorage`) já tem ambos: `storage.sql: SqlStorage`
      // (com `exec` retornando um `SqlStorageCursor` iterable + `toArray()`)
      // e `storage.transactionSync(callback)` no nível do storage.
      //
      // Importante: passar só `this.ctx.storage.sql` (como na versão
      // antiga) não funciona — o wrapper exige o `transactionSync` no
      // mesmo nível.
      const sql = new DurableObjectSqliteSyncWrapper(this.ctx.storage);
      const storage = new SQLiteSyncStorage<TLRecord>({ sql });

      this.room = new TLSocketRoom<TLRecord, void>({
        schema,
        storage,
        clientTimeout: Infinity,
        onSessionRemoved: (_room, { sessionId, numSessionsRemaining }) => {
          // Última sessão saindo: o room pode ser fechado (libera o
          // TLSyncRoom interno). Os dados continuam seguros no SQLite.
          if (numSessionsRemaining === 0) {
            this.room?.close();
            this.room = null;
            this.roomPromise = null;
          }
          console.log(
            `[tldraw-sync] session ${sessionId} removed (${numSessionsRemaining} remaining)`
          );
        },
      });

      return this.room;
    });

    return this.roomPromise;
  }

  /**
   * Único endpoint do DO: upgrade de WebSocket.
   */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== "/connect") {
      return new Response("Not found", { status: 404 });
    }
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket upgrade", { status: 400 });
    }

    const room = await this.getOrCreateRoom();
    const { 0: client, 1: server } = new WebSocketPair();
    const sessionId = crypto.randomUUID();

    // Hibernation API: `acceptWebSocket` (no `ctx`, não no `server`) é o que
    // habilita o DO a hibernar mantendo o WS aberto.
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ sessionId } satisfies SocketAttachment);

    room.handleSocketConnect({ sessionId, socket: server });

    return new Response(null, { status: 101, webSocket: client });
  }

  /**
   * Mensagem recebida. Pode ser invocada:
   *   - Logo após `fetch` (mesma request) — sessão já está no room.
   *   - Após hibernação — o room foi recriado em `getOrCreateRoom`, mas a
   *     sessão em si não foi preservada (a memória do room não sobrevive
   *     à hibernação; só os dados no SQLite). `room.handleSocketMessage`
   *     loga warning e descarta a mensagem nesse caso; o client detecta
   *     via keepalive e reconecta.
   */
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    const attachment = ws.deserializeAttachment() as SocketAttachment | null;
    if (!attachment?.sessionId) {
      ws.close(1011, "Missing sessionId attachment");
      return;
    }
    const room = await this.getOrCreateRoom();
    room.handleSocketMessage(attachment.sessionId, message);
  }

  /**
   * WS fechado. No source do `TLSocketRoom`, `handleSocketClose` chama
   * `this.room.handleClose(sessionId)` — equivalente a `handleSocketError`.
   */
  async webSocketClose(
    ws: WebSocket,
    _code: number,
    _reason: string,
    _wasClean: boolean
  ): Promise<void> {
    const attachment = ws.deserializeAttachment() as SocketAttachment | null;
    if (!attachment?.sessionId) return;
    const room = await this.getOrCreateRoom();
    room.handleSocketClose(attachment.sessionId);
  }

  /**
   * Erro de WS. Internamente equivalente ao `handleSocketClose`.
   */
  async webSocketError(ws: WebSocket, _error: unknown): Promise<void> {
    const attachment = ws.deserializeAttachment() as SocketAttachment | null;
    if (!attachment?.sessionId) return;
    const room = await this.getOrCreateRoom();
    room.handleSocketError(attachment.sessionId);
  }
}
