"use client";

import { BubbleChatIcon } from "@hugeicons/core-free-icons";
import { useChatPanel } from "@/context/chatPanel";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";

export function ButtonChatPanel() {
  const { open, toggle } = useChatPanel();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      rounded="xl"
      onClick={toggle}
      aria-label="Abrir assistente IA"
      data-state={open ? "open" : "closed"}
    >
      <Icon icon={BubbleChatIcon} />
    </Button>
  );
}
