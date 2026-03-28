import * as Hugeicons from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

const allIcons = Hugeicons as unknown as Record<string, IconSvgElement>;

const ICONS_NAMES = Object.keys(allIcons).filter((key) => key.endsWith("Icon"));

export function resolveIcon(name: string): IconSvgElement {
  const icon = allIcons[name];

  if (!icon) {
    throw new Error(`Icon ${name} not found`);
  }

  return icon;
}

export { allIcons, ICONS_NAMES };
