"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/context/workspace";
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";
import { authClient } from "@/lib/auth-client";

export function Welcome() {
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const { workspaceSlug } = useWorkspace();
  const { data: session } = authClient.useSession();
  const workspaceName = organizations?.find(
    (org) => org.slug === workspaceSlug,
  )?.name;
  const { members } = useWorkspaceMembers();

  if (isPending) return <Skeleton className="w-full h-[104px] md:h-[125px]" />;

  return (
    <Item variant="muted">
      <ItemContent>
        <span className="text-muted-foreground text-[12px] font-medium tracking-wide">
          Workspace:
        </span>
        <ItemTitle className="text-xl">{workspaceName}</ItemTitle>
        <ItemDescription>
          Organize ideias e tarefas em um só lugar, seja em projetos pessoais ou
          colaborativos.
        </ItemDescription>
      </ItemContent>

      <ItemMedia>
        <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
          <AvatarGroup>
            <Avatar className="sm:flex ">
              {session?.user?.image && (
                <AvatarImage src={session?.user?.image} alt="@shadcn" />
              )}
              <AvatarFallback>
                {session?.user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {members?.map((member) => (
              <Avatar key={member.id} className="sm:flex">
                <AvatarImage src={member?.user?.image} alt={member.user?.name} />
                <AvatarFallback>
                  {member.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </ItemMedia>
    </Item>
  );
}
