"use client";

import {
  Add01Icon,
  Cancel01Icon,
  Menu01FreeIcons,
  Share06Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { useAgentSession } from "@/context/agentSession";
import { useChatPanel } from "@/context/chatPanel";
import { useWorkspace } from "@/context/workspace";
import { useNote } from "@/hook/notes/useNotes";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";

export function AgentHeader({
  onOpenThreads,
}: {
  onOpenThreads?: () => void;
}) {
  const { setOpen } = useChatPanel();
  const {
    noteId,
    activeThread,
    shareThread,
    isSharing,
    startNewChat,
  } = useAgentSession();
  const { workspaceName } = useWorkspace();
  const { data: note } = useNote(noteId ?? "");
  const [sharing, setSharing] = useState(false);

  const canShare = !!activeThread?.canShare;

  const handleShare = async () => {
    if (!activeThread || !canShare) return;
    setSharing(true);
    try {
      await shareThread(activeThread.id);
    } finally {
      setSharing(false);
    }
  };

  const desktopSubtitle = [
    workspaceName,
    note ? note.title || "Sem título" : null,
    activeThread ? activeThread.title || "Nova conversa" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 px-3 pt-2 md:pointer-events-auto md:relative md:inset-auto md:shrink-0 md:border-b md:border-border md:bg-background md:px-4 md:pt-2.5 md:pb-2.5">
      <div className="pointer-events-auto flex h-10 items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {onOpenThreads ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full bg-background px-0 shadow-xs dark:bg-background md:hidden"
              aria-label="Abrir conversas"
              onClick={onOpenThreads}
            >
              <Icon icon={Menu01FreeIcons} />
            </Button>
          ) : null}
          <h2 className="hidden shrink-0 text-sm font-semibold text-foreground md:block">
            Agent
          </h2>
          {desktopSubtitle ? (
            <span className="hidden truncate text-sm text-muted-foreground md:inline">
              {desktopSubtitle}
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {/* Mobile: nova conversa + compartilhar + fechar (pill único, sem divisor) */}
          <div
            className="flex overflow-hidden rounded-full border border-border bg-background shadow-xs dark:bg-background md:hidden"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-none border-0 px-0 shadow-none"
              aria-label="Nova conversa"
              onClick={startNewChat}
            >
              <Icon icon={Add01Icon} className="size-4" />
            </Button>
            {canShare ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-none border-0 px-0 shadow-none"
                disabled={sharing || isSharing}
                aria-label={
                  sharing || isSharing ? "Compartilhando…" : "Compartilhar"
                }
                onClick={() => void handleShare()}
              >
                <Icon icon={Share06Icon} className="size-4" />
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-none border-0 px-0 shadow-none"
              onClick={() => setOpen(false)}
              aria-label="Fechar agent"
            >
              <Icon icon={Cancel01Icon} className="size-4" />
            </Button>
          </div>

          {/* Desktop: compartilhar + fechar */}
          {canShare ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-1.5 md:inline-flex"
              disabled={sharing || isSharing}
              onClick={() => void handleShare()}
            >
              <Icon icon={Share06Icon} className="size-3.5" />
              <span>
                {sharing || isSharing ? "Compartilhando…" : "Compartilhar"}
              </span>
            </Button>
          ) : null}

          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-full hidden md:inline-flex"
            onClick={() => setOpen(false)}
            aria-label="Fechar agent"
          >
            <Icon icon={Cancel01Icon} />
          </Button>
        </div>
      </div>
    </header>
  );
}
