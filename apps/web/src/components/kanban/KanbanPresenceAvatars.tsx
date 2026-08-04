"use client";

import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { KanbanPresenceMember } from "@/hook/kanban/useKanbanRealtime";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const MAX_STACK = 4;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function displayLabel(
  member: KanbanPresenceMember,
  currentUserId: string | undefined,
): string {
  if (currentUserId && member.userId === currentUserId) return "Você";
  return member.name?.trim() || "Usuário";
}

type Props = {
  presence: KanbanPresenceMember[];
  className?: string;
};

export function KanbanPresenceAvatars({ presence, className }: Props) {
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const others = useMemo(
    () => presence.filter((m) => m.userId !== currentUserId),
    [presence, currentUserId],
  );

  const listMembers = useMemo(() => {
    const me = presence.find((m) => m.userId === currentUserId);
    const rest = presence.filter((m) => m.userId !== currentUserId);
    return me ? [...rest, me] : rest;
  }, [presence, currentUserId]);

  // Só mostra quando há alguém além de você
  if (others.length === 0) return null;

  const stack = others.slice(0, MAX_STACK);
  const overflow = others.length - stack.length;
  const onlineCount = others.length;
  const onlineLabel =
    onlineCount === 1 ? "1 online" : `${onlineCount} online`;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              "mr-1 flex items-center gap-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring",
              className,
            )}
            aria-label={`${onlineLabel} neste board`}
          >
            <span className="flex -space-x-2">
              {stack.map((member) => {
                const label = displayLabel(member, currentUserId);
                return (
                  <Tooltip key={member.userId}>
                    <TooltipTrigger
                      render={
                        <span className="relative inline-flex">
                          <Avatar className="size-7 border-2 border-background">
                            {member.image ? (
                              <AvatarImage
                                src={member.image}
                                alt={member.name ?? ""}
                              />
                            ) : null}
                            <AvatarFallback className="text-[10px]">
                              {initials(member.name ?? "?")}
                            </AvatarFallback>
                          </Avatar>
                        </span>
                      }
                    />
                    <TooltipContent side="bottom">{label}</TooltipContent>
                  </Tooltip>
                );
              })}
              {overflow > 0 ? (
                <span className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] text-muted-foreground">
                  +{overflow}
                </span>
              ) : null}
            </span>
            {onlineCount > 1 ? (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {onlineLabel}
              </span>
            ) : null}
          </button>
        }
      />

      <PopoverContent align="start" className="w-64 gap-3 rounded-xl p-3">
        <PopoverHeader className="gap-0.5">
          <PopoverTitle>Online neste board</PopoverTitle>
          <PopoverDescription>{onlineLabel}</PopoverDescription>
        </PopoverHeader>
        <ul className="flex max-h-60 flex-col gap-1.5 overflow-y-auto">
          {listMembers.map((member) => {
            const isYou = currentUserId === member.userId;
            return (
              <li
                key={member.userId}
                className="flex items-center gap-2 rounded-xl px-1.5 py-1"
              >
                <Avatar className="size-7">
                  {member.image ? (
                    <AvatarImage src={member.image} alt={member.name ?? ""} />
                  ) : null}
                  <AvatarFallback className="text-[10px]">
                    {initials(member.name ?? "?")}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-sm">
                  {isYou ? (
                    <>
                      {member.name?.trim() || "Você"}
                      <span className="text-muted-foreground"> (você)</span>
                    </>
                  ) : (
                    member.name?.trim() || "Usuário"
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
