import { describe, expect, it } from "vitest";
import {
  computeFractionalPosition,
  nextAppendPosition,
} from "@/lib/kanban/position";

describe("kanban position helpers", () => {
  it("appends after max position", () => {
    expect(nextAppendPosition(null)).toBe(0);
    expect(nextAppendPosition(2)).toBe(3);
  });

  it("computes fractional positions between neighbors", () => {
    expect(computeFractionalPosition(null, null)).toBe(0);
    expect(computeFractionalPosition(null, 2)).toBe(1);
    expect(computeFractionalPosition(2, null)).toBe(3);
    expect(computeFractionalPosition(2, 4)).toBe(3);
  });
});
