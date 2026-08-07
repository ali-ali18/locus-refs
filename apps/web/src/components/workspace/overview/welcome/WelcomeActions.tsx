"use client";

import { BubbleChatIcon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";

export function WelcomeActions({
  onOpenAgent,
  onOpenEvent,
}: {
  onOpenAgent: () => void;
  onOpenEvent: () => void;
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
      <Button
        size="lg"
        variant="outline"
        className="w-full rounded-full sm:w-auto"
        onClick={onOpenAgent}
      >
        <Icon icon={BubbleChatIcon} data-icon="inline-start" />
        Perguntar ao Agent
      </Button>

      <Button
        size="lg"
        className="w-full rounded-full sm:w-auto"
        onClick={onOpenEvent}
      >
        <Icon icon={Calendar03Icon} data-icon="inline-start" />
        Novo evento
      </Button>
    </div>
  );
}
