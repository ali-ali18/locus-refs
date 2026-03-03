"use client";

import {
  ComputerIcon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

const icons = [
  {
    value: "light",
    icon: <Icon icon={Sun03Icon} />,
  },
  {
    value: "dark",
    icon: <Icon icon={Moon02Icon} />,
  },
  {
    value: "system",
    icon: <Icon icon={ComputerIcon} />,
  },
];

export function ToggleButton({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !theme) return <Skeleton className="w-8 h-8" />;

  return (
    <ToggleGroup
      className={cn("rounded-full", className)}
      variant={"outline"}
      size={"default"}
      orientation="horizontal"
      value={[theme]}
      onValueChange={(values) => {
        const nextTheme = values[0];
        if (nextTheme) setTheme(nextTheme);
      }}
    >
      {icons.map(({ icon, value }) => (
        <ToggleGroupItem key={value} value={value} aria-label={value}>
          {icon}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
