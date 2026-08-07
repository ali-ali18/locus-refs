"use client";

import { useEffect, useState } from "react";
import { HOUR_COL_PX } from "./agenda-constants";
import { nowMarkerLeft } from "./agenda-layout";

export function useAgendaNowMarker() {
  const [nowLeft, setNowLeft] = useState(() => nowMarkerLeft());

  useEffect(() => {
    const updateNow = () => setNowLeft(nowMarkerLeft());

    updateNow();
    const msUntilNextMinute = 60_000 - (Date.now() % 60_000);
    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      updateNow();
      intervalId = window.setInterval(updateNow, 60_000);
    }, msUntilNextMinute);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId != null) window.clearInterval(intervalId);
    };
  }, []);

  return { nowLeft, hourColPx: HOUR_COL_PX };
}
