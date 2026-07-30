"use client";

import { Cancel01Icon, Share06Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { useAgentSession } from "@/context/agentSession";
import { useChatPanel } from "@/context/chatPanel";
import { useWorkspace } from "@/context/workspace";
import { useNote } from "@/hook/notes/useNotes";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";

export function AgentHeader() {
  const { setOpen } = useChatPanel();
  const { noteId, activeThread, shareThread, isSharing } = useAgentSession();
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

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3">
      <div className="min-w-0 flex flex-1 items-center gap-2">
        <h2 className="shrink-0 text-sm font-semibold text-foreground">
          Agent
        </h2>
        <span className="truncate text-sm text-muted-foreground">
          {workspaceName}
          {note ? ` · ${note.title || "Sem título"}` : ""}
          {activeThread
            ? ` · ${activeThread.title || "Nova conversa"}`
            : ""}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {canShare ? (
          <Button
            variant="outline"
            size="sm"
            rounded="xl"
            className="gap-1.5"
            disabled={sharing || isSharing}
            onClick={() => void handleShare()}
          >
            <Icon icon={Share06Icon} className="size-3.5" />
            {sharing || isSharing ? "Compartilhando…" : "Compartilhar"}
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="icon-sm"
          rounded="xl"
          onClick={() => setOpen(false)}
          aria-label="Fechar agent"
        >
          <Icon icon={Cancel01Icon} />
        </Button>
      </div>
    </header>
  );
}
