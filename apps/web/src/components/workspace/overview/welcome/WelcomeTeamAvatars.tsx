"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import type { WorkspaceMember } from "../data/useDashboardOverviewQueries";

export function WelcomeTeamAvatars({
  members,
}: {
  members: WorkspaceMember[];
}) {
  const visible = members.slice(0, 4);
  const extra = Math.max(members.length - visible.length, 0);

  if (members.length === 0) return null;

  return (
    <div className="flex items-center gap-2 self-start sm:self-center">
      <span className="text-xs text-muted-foreground">Equipe</span>
      <AvatarGroup className="*:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background">
        {visible.map((member) => (
          <Avatar key={member.id} size="sm">
            <AvatarImage
              src={member.user?.image ?? undefined}
              alt={member.user?.name}
            />
            <AvatarFallback>
              {member.user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
        {extra > 0 ? (
          <Avatar size="sm">
            <AvatarFallback>+{extra}</AvatarFallback>
          </Avatar>
        ) : null}
      </AvatarGroup>
    </div>
  );
}
