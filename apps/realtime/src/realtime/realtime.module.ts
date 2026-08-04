import { Module } from "@nestjs/common";
import { KanbanEventsSubscriber } from "../redis/kanban-events.subscriber";
import { RealtimeGateway } from "./realtime.gateway";

@Module({
  providers: [RealtimeGateway, KanbanEventsSubscriber],
})
export class RealtimeModule {}
