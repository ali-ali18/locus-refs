"use client";

import { Cancel01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { useChatPanel } from "@/context/chatPanel";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";

interface ChatHeaderProps {
  onClear: () => void;
  hasMessages: boolean;
}

export function ChatHeader({ onClear, hasMessages }: ChatHeaderProps) {
  const { setOpen } = useChatPanel();

  return (
    <header className="flex items-center justify-between border-b border-sidebar-border px-3 py-2.5">
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Assistente IA
      </span>
      <div className="flex items-center gap-1">
        {hasMessages && (
          <Button
            variant="ghost"
            size="icon-sm"
            rounded="xl"
            onClick={onClear}
            aria-label="Limpar conversa"
          >
            <Icon icon={Delete02Icon} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          rounded="xl"
          onClick={() => setOpen(false)}
          aria-label="Fechar assistente"
        >
          <Icon icon={Cancel01Icon} />
        </Button>
      </div>
    </header>
  );
}
