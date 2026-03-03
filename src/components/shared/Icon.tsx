import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";

interface IconProps extends HugeiconsIconProps {}

export function Icon({ ...props }: IconProps) {
  return <HugeiconsIcon className="size-4" {...props} />;
}
