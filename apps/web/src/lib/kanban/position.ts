/**
 * Fractional index between optional neighbors.
 * Used for card/column reorder without renumbering the whole list.
 */
export function computeFractionalPosition(
  beforePosition: number | null | undefined,
  afterPosition: number | null | undefined,
): number {
  if (beforePosition == null && afterPosition == null) return 0;
  if (beforePosition == null) return afterPosition! - 1;
  if (afterPosition == null) return beforePosition + 1;
  return (beforePosition + afterPosition) / 2;
}

export function nextAppendPosition(maxPosition: number | null | undefined): number {
  if (maxPosition == null || Number.isNaN(maxPosition)) return 0;
  return maxPosition + 1;
}
