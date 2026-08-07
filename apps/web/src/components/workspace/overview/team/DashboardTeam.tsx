"use client";

import {
  ArrowRight01Icon,
  MoreHorizontalCircle01Icon,
  PencilEdit01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSettingsDialog } from "@/context/settingsDialog";
import { InviteMemberDialog } from "../../config/InviteMemberDialog";
import { useDashboardOverview } from "../data/useDashboardOverview";
import { memberInitials } from "./member-initials";

const VISIBLE = 6;

export function DashboardTeam() {
  const { members } = useDashboardOverview();
  const { openSettings } = useSettingsDialog();
  const [inviteOpen, setInviteOpen] = useState(false);

  const visible = members.slice(0, VISIBLE);
  const extra = Math.max(members.length - visible.length, 0);

  return (
    <Card size="sm" className="w-full min-w-0 gap-3 overflow-hidden py-3.5">
      <CardHeader className="gap-1">
        <CardTitle>
          Equipe
          <span className="text-muted-foreground"> ({members.length})</span>
        </CardTitle>
        <CardDescription>
          Adicione ou edite a estrutura do time.
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            aria-label="Ver equipe"
            onClick={() => openSettings("workspace-members")}
          >
            <Icon icon={ArrowRight01Icon} />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ainda não há membros neste workspace.
          </p>
        ) : (
          <AvatarGroup>
            {visible.map((member) => (
              <Avatar key={member.id} size="lg" title={member.user?.name}>
                <AvatarImage
                  src={member.user?.image ?? undefined}
                  alt={member.user?.name}
                />
                <AvatarFallback>
                  {memberInitials(member.user?.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {extra > 0 ? (
              <AvatarGroupCount>+{extra}</AvatarGroupCount>
            ) : null}
          </AvatarGroup>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-2">
        <Button
          className="h-8 min-w-0 flex-1 rounded-full px-3 sm:flex-none md:h-9 md:px-4"
          onClick={() => setInviteOpen(true)}
        >
          <Icon icon={PlusSignIcon} data-icon="inline-start" />
          Adicionar
        </Button>
        <Button
          variant="outline"
          className="h-8 min-w-0 flex-1 rounded-full px-3 sm:flex-none md:h-9 md:px-4"
          onClick={() => openSettings("workspace-members")}
        >
          <Icon icon={PencilEdit01Icon} data-icon="inline-start" />
          Gerenciar
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="hidden rounded-full sm:ml-auto sm:inline-flex md:size-9"
          aria-label="Mais opções da equipe"
          onClick={() => openSettings("workspace-members")}
        >
          <Icon icon={MoreHorizontalCircle01Icon} />
        </Button>
      </CardFooter>

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        showDefaultTrigger={false}
      />
    </Card>
  );
}
