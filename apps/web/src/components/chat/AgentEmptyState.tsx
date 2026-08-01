"use client";

import {
  ListTodoIcon,
  PencilLineIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Suggestion } from "@/components/ai-elements/suggestion";
import { useAgentSession } from "@/context/agentSession";
import { useSession } from "@/lib/auth-client";
import {
  type AgentSkillId,
  listAgentSkills,
} from "@/lib/ai/skills";
import { ChatInput } from "./ChatInput";

const FEATURED_SKILL_IDS: AgentSkillId[] = [
  "find-related",
  "summarize-note",
  "continue-writing",
  "plan-from-note",
];

const SKILL_ICONS: Record<AgentSkillId, LucideIcon> = {
  "find-related": SearchIcon,
  "summarize-note": SparklesIcon,
  "continue-writing": PencilLineIcon,
  "extract-actions": ListTodoIcon,
  "plan-from-note": ListTodoIcon,
  "rewrite-tone": PencilLineIcon,
};

function firstName(fullName: string | undefined | null): string {
  if (!fullName?.trim()) return "";
  return fullName.trim().split(/\s+/)[0] ?? "";
}

export function AgentEmptyState() {
  const { data: session } = useSession();
  const { noteId, send, stop, status } = useAgentSession();
  const skills = listAgentSkills({ hasNote: !!noteId })
    .filter((skill) => FEATURED_SKILL_IDS.includes(skill.id))
    .slice(0, 4);
  const name = firstName(session?.user?.name);
  const greeting = name
    ? `Como posso ajudar, ${name}?`
    : "Como posso ajudar?";

  return (
    <div className="scrollbar-none flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 pt-16 pb-[max(4rem,env(safe-area-inset-bottom))] md:pt-6">
      <div className="flex w-full max-w-2xl flex-col items-center gap-8">
        <h1 className="text-center font-serif text-3xl tracking-tight text-foreground md:text-4xl">
          {greeting}
        </h1>

        <div className="w-full">
          <ChatInput
            onSend={send}
            onStop={stop}
            status={status}
            noteId={noteId}
            variant="hero"
            placeholder="Pergunte alguma coisa… Digite @ para mencionar"
          />
        </div>

        <div className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-2">
          {skills.map((skill) => {
            const Icon = SKILL_ICONS[skill.id];
            return (
              <Suggestion
                key={skill.id}
                suggestion={skill.label}
                className="gap-2 rounded-xl"
                onClick={() => send(skill.prompt, { skillId: skill.id })}
              >
                <Icon className="size-3.5 shrink-0 opacity-70" />
                {skill.label}
              </Suggestion>
            );
          })}
        </div>
      </div>
    </div>
  );
}
