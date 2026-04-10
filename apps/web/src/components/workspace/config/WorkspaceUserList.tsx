"use client";

import {
  Cancel01Icon,
  MoreHorizontalIcon,
  UserBlock01Icon,
  UserEdit01Icon,
} from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceInvitations } from "@/hook/workspace/useWorkspaceInvitations";
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { RemoveMemberDialog } from "./RemoveMemberDialog";
import { UpdateMemberRoleDialog } from "./UpdateMemberRoleDialog";
import { WorkspaceHeaderConfig } from "./WorkspaceHeaderConfig";

export function WorkspaceUserList() {
  const {
    members,
    currentMember,
    isLoading,
    data: membersData,
  } = useWorkspaceMembers();

  const { invitations, cancelInvitation, isCancelling } =
    useWorkspaceInvitations();

  const [roleDialogMemberId, setRoleDialogMemberId] = useState<string | null>(
    null,
  );
  const [removeDialogMemberId, setRemoveDialogMemberId] = useState<
    string | null
  >(null);

  const isAdminOrOwner =
    currentMember?.role === "owner" || currentMember?.role === "admin";

  if (isLoading) {
    return (
      <div>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <WorkspaceHeaderConfig
        title="Gerenciamento de usuários"
        description="Faça a gestão de todos os membros participantes do workspace."
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Total de usuários ({membersData?.data?.total})
          </span>
          {isAdminOrOwner && <InviteMemberDialog />}
        </div>

        <ItemGroup>
          <Item variant="muted">
            <ItemMedia>
              <Avatar>
                <AvatarImage src={currentMember?.user.image} />
                <AvatarFallback>
                  {currentMember?.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent className="gap-0.5">
              <ItemTitle>
                {currentMember?.user.name}{" "}
                <span className="text-xs capitalize text-muted-foreground">
                  ({currentMember?.role})
                </span>
              </ItemTitle>
              <ItemDescription>{currentMember?.user.email}</ItemDescription>
            </ItemContent>
          </Item>

          <Separator />

          {members?.map((member) => (
            <Item variant="outline" key={member.user.id}>
              <ItemMedia>
                <Avatar>
                  <AvatarImage src={member.user.image} />
                  <AvatarFallback>
                    {member.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="gap-0.5">
                <ItemTitle>
                  {member.user.name}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({member.role})
                  </span>
                </ItemTitle>
                <ItemDescription>{member.user.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={"rounded-xl"}
                    render={
                      <Button variant={"ghost"} rounded={"xl"}>
                        <Icon icon={MoreHorizontalIcon} />
                      </Button>
                    }
                  ></DropdownMenuTrigger>
                  <DropdownMenuContent className={"w-52"}>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Funções</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => setRoleDialogMemberId(member.id)}
                      >
                        <Icon icon={UserEdit01Icon} /> Alterar cargo
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setRemoveDialogMemberId(member.id)}
                      >
                        <Icon icon={UserBlock01Icon} /> Remover usuario
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <UpdateMemberRoleDialog
                  memberId={member.id}
                  memberName={member.user.name}
                  currentRole={member.role}
                  open={roleDialogMemberId === member.id}
                  onOpenChange={(open) =>
                    setRoleDialogMemberId(open ? member.id : null)
                  }
                />

                <RemoveMemberDialog
                  memberId={member.id}
                  memberName={member.user.name}
                  memberEmail={member.user.email}
                  open={removeDialogMemberId === member.id}
                  onOpenChange={(open) =>
                    setRemoveDialogMemberId(open ? member.id : null)
                  }
                />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </div>

      {isAdminOrOwner && invitations.length > 0 && (
        <div className="flex flex-col gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            Convites pendentes ({invitations.length})
          </span>
          <ItemGroup>
            {invitations.map((inv) => (
              <Item variant="outline" key={inv.id}>
                <ItemContent className="gap-0.5">
                  <ItemTitle>
                    {inv.email}{" "}
                    <Badge variant="outline" className="ml-1 capitalize">
                      {inv.role}
                    </Badge>
                  </ItemTitle>
                  <ItemDescription>
                    Expira em{" "}
                    {format(new Date(inv.expiresAt), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="ghost"
                    rounded="full"
                    type="button"
                    disabled={isCancelling}
                    onClick={() => cancelInvitation(inv.id)}
                  >
                    <Icon icon={Cancel01Icon} />
                    <span className="sr-only">Cancelar convite</span>
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </div>
      )}
    </section>
  );
}
