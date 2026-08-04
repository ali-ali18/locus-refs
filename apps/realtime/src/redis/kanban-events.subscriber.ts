import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import {
  KANBAN_EVENTS_CHANNEL,
  type KanbanRealtimeEvent,
} from "@refstash/shared";
import Redis from "ioredis";
import { RealtimeGateway } from "../realtime/realtime.gateway";

function isKanbanRealtimeEvent(value: unknown): value is KanbanRealtimeEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Record<string, unknown>;
  return (
    typeof event.type === "string" &&
    typeof event.boardId === "string" &&
    typeof event.workspaceId === "string" &&
    typeof event.actorId === "string" &&
    typeof event.at === "string" &&
    event.payload !== undefined
  );
}

@Injectable()
export class KanbanEventsSubscriber implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KanbanEventsSubscriber.name);
  private sub: Redis | null = null;

  constructor(@Inject(RealtimeGateway) private readonly gateway: RealtimeGateway) {}

  async onModuleInit() {
    const url = process.env.REDIS_URL;
    if (!url) {
      this.logger.error("REDIS_URL is not set — kanban event subscriber disabled");
      return;
    }

    this.sub = new Redis(url, { maxRetriesPerRequest: null });
    this.sub.on("error", (err) => {
      this.logger.error(`Redis subscriber error: ${err.message}`);
    });

    await this.sub.subscribe(KANBAN_EVENTS_CHANNEL);
    this.logger.log(`Subscribed to ${KANBAN_EVENTS_CHANNEL}`);

    this.sub.on("message", (channel, message) => {
      if (channel !== KANBAN_EVENTS_CHANNEL) return;

      try {
        const parsed: unknown = JSON.parse(message);
        if (!isKanbanRealtimeEvent(parsed)) {
          this.logger.warn(`Invalid kanban event payload: ${message.slice(0, 200)}`);
          return;
        }
        this.gateway.broadcastKanbanEvent(parsed);
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Failed to handle kanban event: ${reason}`);
      }
    });
  }

  async onModuleDestroy() {
    if (!this.sub) return;
    try {
      await this.sub.unsubscribe(KANBAN_EVENTS_CHANNEL);
      this.sub.disconnect();
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Error closing Redis subscriber: ${reason}`);
    }
    this.sub = null;
  }
}
