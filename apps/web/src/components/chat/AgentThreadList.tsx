"use client";

import {
  Add01Icon,
  Cancel01Icon,
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
        className="flex w-full flex-col gap-0.5 pr-10 text-left"
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
          size="icon-sm"
          rounded="xl"
          className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100"
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

export function AgentThreadList({
  variant = "embedded",
  onThreadSelect,
  onClose,
}: {
  variant?: "embedded" | "sheet";
  /** Chamado após selecionar/criar conversa (ex.: fechar Sheet no mobile). */
  onThreadSelect?: () => void;
  /** Fechar o Sheet (só no modo sheet). */
  onClose?: () => void;
}) {
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

  const handleSelect = (id: string) => {
    setActiveThreadId(id);
    onThreadSelect?.();
  };

  const handleNewChat = () => {
    startNewChat();
    onThreadSelect?.();
  };

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 shrink-0 flex-col bg-background",
        variant === "embedded"
          ? "w-[min(100%,20rem)] border-r border-border"
          : "w-full",
      )}
    >
      <div className="flex h-14 shrink-0 items-center gap-2 px-3">
        {variant === "sheet" && onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            rounded="full"
            aria-label="Fechar conversas"
            onClick={onClose}
          >
            <Icon icon={Cancel01Icon} className="size-4" />
          </Button>
        ) : null}
        <h2 className="min-w-0 flex-1 text-sm font-semibold text-foreground">
          Conversas
        </h2>
        {variant === "embedded" ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            rounded="xl"
            aria-label="Nova conversa"
            onClick={handleNewChat}
          >
            <Icon icon={Add01Icon} className="size-4" />
          </Button>
        ) : null}
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
          <div className="flex flex-col gap-2 p-3">
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
              onSelect={() => handleSelect(thread.id)}
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
