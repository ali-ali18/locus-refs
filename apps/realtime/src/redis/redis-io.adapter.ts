import type { INestApplication } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import type { ServerOptions } from "socket.io";

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter> | null = null;

  constructor(app: INestApplication) {
    super(app);
  }

  async connectToRedis() {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error("REDIS_URL is not set");

    const pubClient = new Redis(url, { maxRetriesPerRequest: null });
    const subClient = pubClient.duplicate();

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        pubClient.once("ready", () => resolve());
        pubClient.once("error", reject);
      }),
      new Promise<void>((resolve, reject) => {
        subClient.once("ready", () => resolve());
        subClient.once("error", reject);
      }),
    ]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    if (!this.adapterConstructor) {
      throw new Error("Redis adapter not connected — call connectToRedis() first");
    }
    server.adapter(this.adapterConstructor);
    return server;
  }
}
