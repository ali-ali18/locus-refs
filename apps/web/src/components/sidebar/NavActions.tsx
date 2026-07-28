"use client";

import {
  BubbleChatIcon,
  Moon02Icon,
  MoreHorizontalCircle01Icon,
  Settings01Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useChatPanel } from "@/context/chatPanel";
import { useSettingsDialog } from "@/context/settingsDialog";
import { useIsMobile } from "@/hook/use-mobile";
import { ButtonChatPanel } from "../chat/ButtonChatPanel";
import { ButtonTheme } from "../shared/ToggleButton";

export function NavActions() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toggle: toggleChat } = useChatPanel();
  const { openSettings } = useSettingsDialog();
  const { theme, setTheme } = useTheme();

  if (!isMobile) {
    return (
      <div className="flex items-center gap-1">
        <ButtonChatPanel />
        <ButtonTheme />
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            rounded="xl"
            className="data-open:bg-accent"
            aria-label="Ações"
          >
            <Icon icon={MoreHorizontalCircle01Icon} className="size-4.5" />
          </Button>
        }
      />
      <PopoverContent className="w-48 rounded-xl p-1" align="end">
        <div className="flex flex-col gap-0.5">
          <Button
            variant="ghost"
            rounded="xl"
            className="w-full justify-start gap-2"
            onClick={() => {
              setOpen(false);
              toggleChat();
            }}
          >
            <Icon icon={BubbleChatIcon} />
            Assistente IA
          </Button>
          <Button
            variant="ghost"
            rounded="xl"
            className="w-full justify-start gap-2"
            onClick={() => {
              setOpen(false);
              openSettings();
            }}
          >
            <Icon icon={Settings01Icon} />
            Configurações
          </Button>
          <Button
            variant="ghost"
            rounded="xl"
            className="w-full justify-start gap-2"
            onClick={() => {
              setTheme(theme === "light" ? "dark" : "light");
              setOpen(false);
            }}
          >
            <Icon icon={theme === "dark" ? Moon02Icon : Sun03Icon} />
            {theme === "dark" ? "Modo claro" : "Modo escuro"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
