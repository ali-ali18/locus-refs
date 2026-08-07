import { hoursOfDay } from "@/components/calendar/calendar-utils";

export const HOUR_COL_PX = 88;
export const LANE_H = 64;
export const LANE_GAP = 8;
export const MIN_DURATION_MIN = 30;
export const DAY_HOURS = hoursOfDay();
export const DAY_WIDTH = DAY_HOURS.length * HOUR_COL_PX;
