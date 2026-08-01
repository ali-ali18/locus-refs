"use client";

import {
  BubbleChatIcon,
  MoreHorizontalCircle01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
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

export function NavActions() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toggle: toggleChat } = useChatPanel();
  const { openSettings } = useSettingsDialog();

  if (!isMobile) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
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
            className="w-full justify-start gap-2"
            onClick={() => {
              setOpen(false);
              toggleChat();
            }}
          >
            <Icon icon={BubbleChatIcon} />
            Agent
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => {
              setOpen(false);
              openSettings();
            }}
          >
            <Icon icon={Settings01Icon} />
            Configurações
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
