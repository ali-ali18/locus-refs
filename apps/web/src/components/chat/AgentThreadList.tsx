"use client";

import {
  Add01Icon,
  Delete02Icon,
  Globe02Icon,
  LockIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { useMemo, useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/components/workspace/overview/activity/formatRelativeTime";
import { useAgentSession } from "@/context/agentSession";
import type { AgentThreadSummary } from "@/types/agent-thread.type";
import { cn } from "@/lib/utils";

function ThreadPreview({
  thread,
  isActive,
  onSelect,
  onDelete,
}: {
  thread: AgentThreadSummary;
  isActive: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}) {
  const when = formatRelativeTime(thread.updatedAt);

  return (
    <div
      className={cn(
        "group relative flex w-full flex-col gap-0.5 border-b border-border px-3 py-3 text-left transition-colors",
        isActive ? "bg-accent/60" : "hover:bg-muted/40",
      )}
    >
      <button
        type="button"
        className="flex w-full flex-col gap-0.5 text-left"
        onClick={onSelect}
      >
        <div className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
            {thread.title || "Nova conversa"}
          </span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {when}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon
            icon={thread.visibility === "workspace" ? Globe02Icon : LockIcon}
            className="size-3 shrink-0"
          />
          <span className="truncate">
            {thread.visibility === "workspace"
              ? thread.createdByName
                ? `Workspace · ${thread.createdByName}`
                : "Workspace"
              : "Privada"}
            {thread.messageCount > 0
              ? ` · ${thread.messageCount} msg`
              : " · vazia"}
          </span>
        </div>
      </button>
      {onDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          rounded="xl"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
          aria-label="Excluir conversa"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Icon icon={Delete02Icon} className="size-3.5 text-destructive" />
        </Button>
      ) : null}
    </div>
  );
}

export function AgentThreadList() {
  const {
    threads,
    isThreadsLoading,
    threadId,
    setActiveThreadId,
    startNewChat,
    deleteThread,
  } = useAgentSession();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter((t) =>
      (t.title ?? "nova conversa").toLowerCase().includes(q),
    );
  }, [query, threads]);

  return (
    <aside className="flex h-full min-h-0 w-[min(100%,20rem)] shrink-0 flex-col border-r border-border bg-background">
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
        <h2 className="text-sm font-semibold text-foreground">Conversas</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          rounded="xl"
          aria-label="Nova conversa"
          onClick={startNewChat}
        >
          <Icon icon={Add01Icon} className="size-4" />
        </Button>
      </div>

      <div className="shrink-0 px-3 py-2">
        <div className="relative">
          <Icon
            icon={Search01Icon}
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar conversas…"
            className="h-8 rounded-xl pl-8 text-sm"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isThreadsLoading ? (
          <div className="space-y-2 p-3">
            {["a", "b", "c", "d"].map((k) => (
              <Skeleton key={k} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            {query.trim()
              ? "Nenhuma conversa encontrada."
              : "Nenhuma conversa ainda."}
          </p>
        ) : (
          filtered.map((thread) => (
            <ThreadPreview
              key={thread.id}
              thread={thread}
              isActive={thread.id === threadId}
              onSelect={() => setActiveThreadId(thread.id)}
              onDelete={
                thread.canDelete
                  ? () => {
                      void deleteThread(thread.id);
                    }
                  : undefined
              }
            />
          ))
        )}
      </div>
    </aside>
  );
}
