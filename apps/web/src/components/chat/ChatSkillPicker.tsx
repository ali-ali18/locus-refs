"use client";

import { Note01Icon, Scroll01Icon } from "@hugeicons/core-free-icons";
import { useMemo } from "react";
import { Icon } from "@/components/shared/Icon";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAgentSkills } from "@/hook/ai/useAgentSkills";
import type { AgentSkill } from "@/types/agent-skill.type";

export interface SkillQueryState {
  start: number;
  query: string;
}

/** Detecta `/query` no caret (mesmo padrão do @). */
export function detectSkillQuery(
  value: string,
  caret: number,
): SkillQueryState | null {
  const before = value.slice(0, caret);
  const match = before.match(/(^|[\s([{])\/([^\s/]*)$/);
  if (!match) return null;
  const slashIndex = before.lastIndexOf("/");
  return { start: slashIndex, query: match[2] ?? "" };
}

function matchesQuery(label: string, query: string): boolean {
  if (!query) return true;
  return label.toLowerCase().includes(query.toLowerCase());
}

const itemClassName =
  "rounded-xl px-3 py-2 data-selected:bg-accent data-selected:text-accent-foreground [&>*:last-child]:hidden";

export function ChatSkillPicker({
  query,
  noteId,
  onSelect,
}: {
  query: string;
  noteId?: string;
  onSelect: (skill: AgentSkill) => void;
}) {
  const { data: skills = [], isLoading } = useAgentSkills();

  const items = useMemo(
    () =>
      skills
        .filter((skill) => (skill.requiresNote ? !!noteId : true))
        .filter(
          (skill) =>
            matchesQuery(skill.title, query) ||
            matchesQuery(skill.description ?? "", query),
        )
        .slice(0, 10),
    [skills, query, noteId],
  );

  return (
    <div className="absolute bottom-full left-0 z-50 mb-2 w-full max-w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-border bg-popover text-popover-foreground shadow-lg">
      <Command shouldFilter={false} className="rounded-3xl p-1.5">
        <CommandList className="max-h-64 scrollbar-none">
          {isLoading ? (
            <CommandEmpty className="py-8 text-muted-foreground">
              Carregando skills…
            </CommandEmpty>
          ) : items.length === 0 ? (
            <CommandEmpty className="py-8 text-muted-foreground">
              Nenhuma skill encontrada.
            </CommandEmpty>
          ) : (
            <CommandGroup
              heading="Skills"
              className="p-0 **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:pb-1"
            >
              {items.map((skill) => (
                <CommandItem
                  key={skill.id}
                  value={`skill ${skill.title} ${skill.id}`}
                  className={itemClassName}
                  onSelect={() => onSelect(skill)}
                >
                  <Icon
                    icon={Scroll01Icon}
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                  <span className="min-w-0 flex-1 truncate">{skill.title}</span>
                  {skill.requiresNote ? (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Icon icon={Note01Icon} className="size-3" />
                      Nota
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {skill.visibility === "personal"
                        ? "Pessoal"
                        : "Workspace"}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}
