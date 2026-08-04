import "server-only";

import {
  KANBAN_EVENTS_CHANNEL,
  type KanbanRealtimeEvent,
} from "@refstash/shared";
import Redis from "ioredis";

let client: Redis | null | undefined;

function getRedis(): Redis | null {
  if (client !== undefined) return client;

  const url = process.env.REDIS_URL;
  if (!url) {
    client = null;
    return null;
  }

  client = new Redis(url, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    lazyConnect: true,
  });
  client.on("error", (err) => {
    console.error("[realtime] redis error", err.message);
  });
  return client;
}

/** Best-effort: never throws to callers. */
export async function publishKanbanEvent(
  event: KanbanRealtimeEvent,
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    if (redis.status !== "ready") {
      await redis.connect();
    }
    await redis.publish(KANBAN_EVENTS_CHANNEL, JSON.stringify(event));
  } catch (err) {
    console.error("[realtime] publishKanbanEvent failed", err);
  }
}
