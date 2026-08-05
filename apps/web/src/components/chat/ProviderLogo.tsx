"use client";

import type { ComponentProps } from "react";
import { ModelSelectorLogo } from "@/components/ai-elements/model-selector";
import { cn } from "@/lib/utils";

type Props = {
  provider: string;
  className?: string;
} & Omit<ComponentProps<"img">, "src" | "alt" | "provider">;

function AtlasCloudLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      fill="currentColor"
      fillRule="evenodd"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-3 shrink-0", className)}
    >
      <title>Atlas Cloud</title>
      <path d="M20.2,18.01L12,0.47,3.8,18.01l-2.58,5.52c1.62,-1.05,3.39,-1.86,5.26,-2.41,1.76,-0.51,3.61,-0.79,5.52,-0.79,0.98,0,1.95,0.08,2.9,0.22l-1.86,-4.3c-0.53,-0.1,-2.87,-0.1,-4.59,0.3l3.56,-8.28,5.52,12.85c0.01,0,0.02,0.01,0.03,0.01,1.86,0.55,3.62,1.36,5.23,2.4l-2.58,-5.52Z" />
    </svg>
  );
}

/** Logo do provider: Atlas local; demais via models.dev (ModelSelectorLogo). */
export function ProviderLogo({ provider, className, ...props }: Props) {
  if (provider === "atlas") {
    return <AtlasCloudLogo className={className} />;
  }

  return (
    <ModelSelectorLogo provider={provider} className={className} {...props} />
  );
}
