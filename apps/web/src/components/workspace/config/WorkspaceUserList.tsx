"use client";

import { Edit01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/shared/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";
import { WorkspaceHeaderConfig } from "./WorkspaceHeaderConfig";

export function WorkspaceUserList() {
  const {
    members,
    currentMember,
    isLoading,
    data: membersData,
  } = useWorkspaceMembers();

  if (isLoading) {
    return <div></div>;
  }

  return (
    <section className="flex flex-col gap-6">
      <WorkspaceHeaderConfig
        title="Gerenciamento de usuários"
        description="Faça a gestão de todos os membros participantes do workspace."
      />

      <div className="flex flex-col gap-4">
        <span className="text-sm font-medium text-muted-foreground">Total de usuarios ({membersData?.data?.total})</span>
        <ItemGroup>
          <Item variant={"muted"}>
            <ItemMedia>
              <Avatar>
                <AvatarImage src={currentMember?.user.image} />
                <AvatarFallback>
                  {currentMember?.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent className="gap-0.5">
              <ItemTitle>{currentMember?.user.name} <span className="text-xs capitalize text-muted-foreground">({currentMember?.role})</span></ItemTitle>
              <ItemDescription>{currentMember?.user.email}</ItemDescription>
            </ItemContent>
          </Item>

          {members?.map((member) => (
            <Item variant={"outline"} key={member.user.id}>
              <ItemMedia>
                <Avatar>
                  <AvatarImage src={member.user.image} />
                  <AvatarFallback>
                    {member.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="gap-0.5">
                <ItemTitle>{member.user.name} <span className="text-xs">({member.role})</span></ItemTitle>
                <ItemDescription>{member.user.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant={"ghost"} rounded={"full"}>
                  <Icon icon={Edit01Icon} />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </div>
    </section>
  );
}
