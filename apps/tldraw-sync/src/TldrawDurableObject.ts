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
 * 1 instância por board (criada via
 * `env.TLDRAW_DURABLE_OBJECT.idFromName("board-{boardId}")`).
 *
 * Persistência: as shapes vivem no SQLite embutido do DO, gerenciado por
 * `SQLiteSyncStorage` + `DurableObjectSqliteSyncWrapper`.
 *
 * IMPORTANTE — este DO NÃO usa WebSocket Hibernation API
 * (`server.accept()` em vez de `ctx.acceptWebSocket()`).
 *
 * Por quê? A versão `@tldraw/sync-core@4.5.12` (a única compatível com
 * `tldraw@4.5.12` no apps/web) NÃO expõe uma API pública de "resume" de
 * sessão pós-hibernação — o `TLSocketRoom` mantém o `Map<sessionId, RoomSession>`
 * em memória, e uma hibernação entre `fetch()` e `webSocketMessage()`
 * derruba a sessão silenciosamente. Versões mais novas do `@tldraw/sync-core`
 * têm `onSessionSnapshot` + `handleSocketResume`, mas não a 4.5.12.
 *
 * Tradeoff: o DO não hiberna enquanto há WebSockets abertos, então
 * consome mais memória. Em troca, o `TLSocketRoom` e suas sessões ficam
 * em memória continuamente, e sync/presença/cursors funcionam sem
 * reconnect. Para boards sem clientes conectados, o DO continua
 * hibernável normalmente (CF faz evict de DOs ociosos).
 */
export class TldrawDurableObject extends DurableObject<Env> {
  private room: TLSocketRoom<TLRecord, void> | null = null;

  private getOrCreateRoom(): Promise<TLSocketRoom<TLRecord, void>> {
    if (this.room) return Promise.resolve(this.room);

    return this.ctx.blockConcurrencyWhile(async () => {
      if (this.room) return this.room;

      const sql = new DurableObjectSqliteSyncWrapper(this.ctx.storage);
      const storage = new SQLiteSyncStorage<TLRecord>({ sql });

      this.room = new TLSocketRoom<TLRecord, void>({
        schema,
        storage,
        // Cloudflare Workers faz keep-alive automático nos WebSockets,
        // então desabilita o idle timeout do room. Sem isso, sessões
        // seriam derrubadas a cada ~20s de inatividade.
        clientTimeout: Infinity,
        onSessionRemoved: (_room, { sessionId, numSessionsRemaining }) => {
          // Última sessão saindo: libera o TLSyncRoom interno.
          // Os dados continuam seguros no SQLite.
          if (numSessionsRemaining === 0) {
            this.room?.close();
            this.room = null;
          }
          console.log(
            `[tldraw-sync] session ${sessionId} removed (${numSessionsRemaining} remaining)`,
          );
        },
      });

      return this.room;
    });
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

    server.accept();

    // `handleSocketConnect` registra internamente os listeners de
    // message/close/error no socket (e dispara `onSessionRemoved` no close).
    // NÃO adicionar listeners manualmente aqui — isso processaria cada
    // mensagem duas vezes, corrompendo o protocolo de sync (o cliente recebe
    // `push_result` duplicado) e causando loop infinito de reconnect.
    room.handleSocketConnect({ sessionId, socket: server });

    return new Response(null, { status: 101, webSocket: client });
  }
}
