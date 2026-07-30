"use client";

import { Cancel01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { useChatPanel } from "@/context/chatPanel";
import { useAgentSession } from "@/context/agentSession";
import { useWorkspace } from "@/context/workspace";
import { useNote } from "@/hook/notes/useNotes";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export function AgentHeader() {
  const { setOpen } = useChatPanel();
  const { clear, messages, noteId } = useAgentSession();
  const { workspaceName } = useWorkspace();
  const { data: note } = useNote(noteId ?? "");
  const hasMessages = messages.length > 0;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3">
      <SidebarTrigger className="-ml-1" />
      <div className="min-w-0 flex flex-1 flex-col gap-0.5">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Agent
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {workspaceName}
          {note ? ` · ${note.title || "Sem título"}` : ""}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {hasMessages ? (
          <Button
            variant="ghost"
            size="icon-sm"
            rounded="xl"
            onClick={clear}
            aria-label="Limpar conversa"
          >
            <Icon icon={Delete02Icon} />
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
