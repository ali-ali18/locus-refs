"use client";

import { Cancel01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { useChatPanel } from "@/context/chatPanel";
import { useWorkspace } from "@/context/workspace";
import { useNote } from "@/hook/notes/useNotes";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";

interface ChatHeaderProps {
  onClear: () => void;
  hasMessages: boolean;
  noteId?: string;
}

export function ChatHeader({
  onClear,
  hasMessages,
  noteId,
}: ChatHeaderProps) {
  const { setOpen } = useChatPanel();
  const { workspaceName } = useWorkspace();
  const { data: note } = useNote(noteId ?? "");

  return (
    <header className="flex items-center justify-between gap-2 border-b border-sidebar-border px-3 py-2.5">
      <div className="min-w-0 flex flex-col gap-0.5">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Agent
        </span>
        <span className="truncate text-xs text-sidebar-foreground/70">
          {workspaceName}
          {note ? ` · ${note.title || "Sem título"}` : ""}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
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
          aria-label="Fechar agent"
        >
          <Icon icon={Cancel01Icon} />
        </Button>
      </div>
    </header>
  );
}
