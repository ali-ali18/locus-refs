"use client";

import {
  BubbleChatIcon,
  Delete02Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { EmptyApp } from "@/components/base/EmptyApp";
import { CreateAgentSkillDialog } from "@/components/chat/CreateAgentSkillDialog";
import { Icon } from "@/components/shared/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAgentSkillMutations,
  useAgentSkills,
} from "@/hook/ai/useAgentSkills";
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";
import { useSession } from "@/lib/auth-client";
import type { AgentSkill } from "@/types/agent-skill.type";

function canManageSkill(
  skill: AgentSkill,
  userId: string | undefined,
  isAdmin: boolean,
): boolean {
  if (!userId) return false;
  if (skill.userId === userId) return true;
  return skill.visibility === "workspace" && isAdmin;
}

function formatUpdatedAt(value: string): string {
  try {
    return format(new Date(value), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return "—";
  }
}

function authorLabel(
  skill: AgentSkill,
  currentUserId: string | undefined,
): string {
  if (currentUserId && skill.userId === currentUserId) return "Você";
  return skill.user?.name?.trim() || "Membro";
}

function typeLabel(visibility: AgentSkill["visibility"]): string {
  return visibility === "personal" ? "Pessoal" : "Workspace";
}

export function WorkspaceAgentSkills() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { currentMember } = useWorkspaceMembers();
  const isAdmin =
    currentMember?.role === "admin" || currentMember?.role === "owner";

  const { data: skills = [], isLoading } = useAgentSkills();
  const { deleteSkill, isDeleting } = useAgentSkillMutations();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<AgentSkill | null>(null);

  const addButton = (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="shrink-0"
      onClick={() => setCreateOpen(true)}
    >
      <Icon icon={PlusSignIcon} className="size-3.5" />
      Adicionar
    </Button>
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight">Skills</h3>
          <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
            Prompts prontos que o Agent executa quando você seleciona no chat.
          </p>
        </div>
        {addButton}
      </div>

      {isLoading ? (
        <div className="space-y-0 divide-y divide-border">
          <Skeleton className="h-9 w-full rounded-none" />
          <Skeleton className="h-11 w-full rounded-none" />
          <Skeleton className="h-11 w-full rounded-none" />
        </div>
      ) : skills.length === 0 ? (
        <EmptyApp
          className="rounded-xl border border-border"
          icon={BubbleChatIcon}
          title="Nenhuma skill ainda"
          description="Crie a primeira — ela aparece no menu + do chat."
          action={addButton}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="h-9 pl-0 text-xs font-medium text-muted-foreground">
                Skill
              </TableHead>
              <TableHead className="h-9 text-xs font-medium text-muted-foreground">
                Tipo
              </TableHead>
              <TableHead className="h-9 hidden md:table-cell text-xs font-medium text-muted-foreground">
                Atualizada
              </TableHead>
              <TableHead className="h-9 text-xs font-medium text-muted-foreground">
                Autor
              </TableHead>
              <TableHead className="h-9 w-10 pr-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill) => {
              const manageable = canManageSkill(skill, userId, isAdmin);
              const name = authorLabel(skill, userId);
              const initial = name.charAt(0).toUpperCase();

              return (
                <TableRow
                  key={skill.id}
                  className={
                    manageable
                      ? "group/skill cursor-pointer border-border hover:bg-muted/40"
                      : "group/skill border-border hover:bg-muted/40"
                  }
                  onClick={() => {
                    if (manageable) setEditingSkill(skill);
                  }}
                >
                  <TableCell className="max-w-[10rem] pl-0 py-3 sm:max-w-[14rem] md:max-w-none">
                    <div className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {skill.title}
                      </span>
                      {skill.requiresNote ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Requer nota aberta
                        </p>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {typeLabel(skill.visibility)}
                  </TableCell>
                  <TableCell className="hidden py-3 text-sm text-muted-foreground md:table-cell tabular-nums whitespace-nowrap">
                    {formatUpdatedAt(skill.updatedAt)}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar size="sm">
                        {skill.user?.image ? (
                          <AvatarImage src={skill.user.image} alt={name} />
                        ) : null}
                        <AvatarFallback>{initial}</AvatarFallback>
                      </Avatar>
                      <span className="truncate text-sm text-muted-foreground">
                        {name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="pr-0 py-3 text-right">
                    {manageable ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-xl text-muted-foreground opacity-0 transition-opacity group-hover/skill:opacity-100 group-focus-within/skill:opacity-100 hover:text-destructive"
                        disabled={isDeleting}
                        aria-label={`Excluir ${skill.title}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          void deleteSkill(skill.id);
                        }}
                      >
                        <Icon icon={Delete02Icon} className="size-3.5" />
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <CreateAgentSkillDialog open={createOpen} onOpenChange={setCreateOpen} />
      <CreateAgentSkillDialog
        open={!!editingSkill}
        skill={editingSkill}
        onOpenChange={(open) => {
          if (!open) setEditingSkill(null);
        }}
      />
    </section>
  );
}
