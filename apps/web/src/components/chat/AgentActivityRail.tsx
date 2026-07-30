"use client";

import type { ToolUIPart } from "ai";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAgentSession } from "@/context/agentSession";
import { useChatPanel } from "@/context/chatPanel";
import { useWorkspace } from "@/context/workspace";
import { cn } from "@/lib/utils";
import {
  getToolCardSnippet,
  getToolCardTitle,
  getToolDomainLabel,
  getToolNavigationTarget,
  getWorkspaceToolParts,
} from "./agentToolLabels";

function isPending(part: ToolUIPart): boolean {
  return part.state === "input-streaming" || part.state === "input-available";
}

export function AgentActivityRail() {
  const router = useRouter();
  const { workspaceSlug } = useWorkspace();
  const { setOpen } = useChatPanel();
  const { messages, isStreaming } = useAgentSession();
  const [collapsed, setCollapsed] = useState(false);

  const lastAssistant = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i]?.role === "assistant") return messages[i];
    }
    return undefined;
  }, [messages]);

  const tools = useMemo(
    () => getWorkspaceToolParts(lastAssistant),
    [lastAssistant],
  );

  const hasPending = tools.some(isPending);

  useEffect(() => {
    if (hasPending || (isStreaming && tools.length > 0)) {
      setCollapsed(false);
    }
  }, [hasPending, isStreaming, tools.length]);

  if (tools.length === 0) return null;

  const handleNavigate = (part: ToolUIPart) => {
    const target = getToolNavigationTarget(part);
    if (!target) return;
    setOpen(false);
    if (target.type === "note") {
      router.push(`/${workspaceSlug}/notes/${target.id}`);
      return;
    }
    router.push(`/${workspaceSlug}/collections/${target.id}`);
  };

  return (
    <aside className="hidden w-[17.5rem] shrink-0 self-start pt-6 pr-4 pb-4 lg:block">
      <div className="flex max-h-[min(100%,calc(100svh-8rem))] flex-col overflow-hidden rounded-2xl bg-muted/40 p-3">
        <button
          type="button"
          className="mb-3 flex w-full shrink-0 items-center justify-between gap-2 px-1 text-left"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <span className="text-sm font-medium text-foreground">
            Ferramentas
          </span>
          <ChevronDownIcon
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              collapsed && "-rotate-90",
            )}
          />
        </button>

        {!collapsed ? (
          <div className="scrollbar-none flex max-h-[min(70svh,32rem)] flex-col gap-2 overflow-y-auto overscroll-contain">
            {tools.map((part) => {
              const pending = isPending(part);
              const error = part.state === "output-error";
              const nav =
                !pending && !error ? getToolNavigationTarget(part) : null;
              const snippet = getToolCardSnippet(part);
              const domain = getToolDomainLabel(part);
              const title = getToolCardTitle(part);

              const card = (
                <div
                  className={cn(
                    "rounded-xl border border-border/60 bg-card p-3 text-left transition-colors",
                    nav && "hover:border-border hover:bg-muted/30",
                    pending && "opacity-80",
                    error && "border-destructive/30",
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <SearchIcon className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] text-muted-foreground">
                        {domain}
                      </p>
                      <p
                        className={cn(
                          "truncate text-sm font-medium text-foreground",
                          pending && "animate-pulse",
                          error && "text-destructive",
                        )}
                      >
                        {title}
                      </p>
                      {snippet ? (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {snippet}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );

              if (!nav) {
                return <div key={part.toolCallId}>{card}</div>;
              }

              return (
                <button
                  key={part.toolCallId}
                  type="button"
                  className="w-full"
                  onClick={() => handleNavigate(part)}
                >
                  {card}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
