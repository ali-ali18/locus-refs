"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAgentSession } from "@/context/agentSession";
import { useChatPanel } from "@/context/chatPanel";
import type { AgentSkillId } from "@/lib/ai/skills";
import { AGENT_PROMPTS } from "./agent-prompts";
import { AgentShortcutButton } from "./AgentShortcutButton";

export function DashboardAgentShortcuts() {
  const { setOpen } = useChatPanel();
  const { send, startNewChat } = useAgentSession();

  function run(prompt: string, skillId?: AgentSkillId) {
    startNewChat();
    setOpen(true);
    window.setTimeout(() => {
      send(prompt, skillId ? { skillId } : undefined);
    }, 0);
  }

  return (
    <Card size="sm" className="h-full min-w-0 gap-3 overflow-hidden py-3.5">
      <CardHeader className="gap-1">
        <CardTitle>Perguntar ao Agent</CardTitle>
        <CardDescription>
          Atalhos para começar uma conversa no workspace.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {AGENT_PROMPTS.map((item) => (
          <AgentShortcutButton
            key={item.id}
            item={item}
            onRun={() => run(item.prompt, item.skillId)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
