import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { RedisIoAdapter } from "./redis/redis-io.adapter";

async function bootstrap() {
  const secret = process.env.REALTIME_JWT_SECRET;
  if (!secret) {
    throw new Error("REALTIME_JWT_SECRET is not set");
  }
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not set");
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  const port = process.env.PORT ?? 4001;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Realtime listening on http://localhost:${port}`);
}

void bootstrap();
