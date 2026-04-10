"use client";

import {
  Alert,
  CheckCircle,
  Info,
  Loading02FreeIcons,
  XCircle,
} from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { Icon } from "../shared/Icon";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <Icon icon={CheckCircle} className="size-4" />,
        info: <Icon icon={Info} className="size-4" />,
        warning: <Icon icon={Alert} className="size-4" />,
        error: <Icon icon={XCircle} className="size-4" />,
        loading: (
          <Icon icon={Loading02FreeIcons} className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
