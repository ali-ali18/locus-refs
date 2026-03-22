"use client";

import { format } from "date-fns";
import {
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from "@/components/kibo-ui/gantt";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { RoadmapItem } from "@/lib/extension/RoadmapBlock";
import { type GanttFeature, getInitials } from "./utils";

type GanttTabProps = {
  items: RoadmapItem[];
  features: GanttFeature[];
};

export function GanttTab({ items, features }: GanttTabProps) {
  return (
    <div className="relative h-82 overflow-hidden">
      <GanttProvider className="absolute inset-0" range="daily">
        <GanttSidebar className="w-52 md:min-w-56">
          <GanttSidebarGroup name="Tarefas">
            {features.map((feature) => (
              <GanttSidebarItem
                key={feature.id}
                className="w-full"
                feature={feature}
              />
            ))}
          </GanttSidebarGroup>
        </GanttSidebar>
        <GanttTimeline>
          <GanttHeader />
          <GanttFeatureList>
            <GanttFeatureListGroup>
              <GanttFeatureRow
                features={features}
                onHover={(feature) => {
                  const item = items.find((i) => i.id === feature.id);
                  return (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: feature.status.color }}
                        />
                        <span className="font-medium">{feature.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <span>{format(feature.startAt, "dd/MM")}</span>
                        <span>→</span>
                        <span>{format(feature.endAt, "dd/MM/yy")}</span>
                      </div>
                      {item?.createdBy && (
                        <div className="flex items-center gap-2">
                          <Avatar className="size-5 overflow-hidden">
                            <AvatarImage
                              alt={item.createdBy.name}
                              src={item.createdBy.image}
                            />
                            <AvatarFallback className="text-[9px]">
                              {getInitials(item.createdBy.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground text-xs">
                            {item.createdBy.name}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }}
              >
                {(feature) => {
                  const item = items.find((i) => i.id === feature.id);
                  return (
                    <div className="flex h-full w-full items-center justify-between gap-1.5 px-2">
                      <p className="flex-1 truncate text-xs font-medium">
                        {feature.name}
                      </p>
                      {item?.createdBy && (
                        <Avatar className="size-4 shrink-0 overflow-hidden">
                          <AvatarImage
                            alt={item.createdBy.name}
                            src={item.createdBy.image}
                          />
                          <AvatarFallback className="text-[8px]">
                            {getInitials(item.createdBy.name)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                }}
              </GanttFeatureRow>
            </GanttFeatureListGroup>
          </GanttFeatureList>
          <GanttToday />
        </GanttTimeline>
      </GanttProvider>
    </div>
  );
}
