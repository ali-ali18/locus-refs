/** biome-ignore-all lint/performance/noImgElement: The image runs on the client side */
import { BrushIcon, DrawingModeIcon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import { isIconUrl, resolveIcon } from "@/lib/icons";
import { Icon } from "../shared/Icon";

interface WorkspaceLogoProps {
  logo?: string | null;
  fallback?: "drawing" | "brushIcon";
  className?: string;
  withBackground?: boolean;
}

export function WorkspaceLogo({
  logo,
  fallback = "brushIcon",
  className,
  withBackground = true,
}: WorkspaceLogoProps) {
  const defaultIcon = fallback === "drawing" ? DrawingModeIcon : BrushIcon;

  if (logo === null || logo === undefined) {
    if (withBackground) {
      return (
        <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Icon icon={defaultIcon} className={className} />
        </div>
      );
    }
    return <Icon icon={defaultIcon} className={className} />;
  }

  if (isIconUrl(logo)) {
    if (logo.startsWith("/storage/")) {
      if (withBackground) {
        return (
          <div className="flex aspect-square size-8 items-center justify-center rounded-xl">
            <img src={logo} alt="" className={`object-contain ${className}`} />
          </div>
        );
      }
      return (
        <img src={logo} alt="" className={`object-contain ${className}`} />
      );
    }

    if (withBackground) {
      return (
        <div className="flex aspect-square size-8 items-center justify-center rounded-xl">
          <Image
            src={logo}
            alt=""
            width={20}
            height={20}
            className={`object-contain ${className}`}
          />
        </div>
      );
    }
    return (
      <Image
        src={logo}
        alt=""
        width={20}
        height={20}
        className={`object-contain ${className}`}
      />
    );
  }

  if (withBackground) {
    return (
      <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <Icon icon={resolveIcon(logo)} className={className} />
      </div>
    );
  }
  return <Icon icon={resolveIcon(logo)} className={className} />;
}
